import {
  setActiveProject,
  createProject,
  NgMorphTree,
  getClasses,
  getParams,
  getConstructors,
  saveActiveProject,
  getImports,
  editImports,
} from 'ng-morph';

setActiveProject(
  createProject(new NgMorphTree(), '/', ['**/*.ts', '**/*.json'])
);

const components = getClasses('**/*.ts', {
  name: '*Component',
});

components.forEach((component) => {
  const constructorParams = getParams(getConstructors(component));

  if (constructorParams.length === 0) {
    return;
  }

  fixInjectImport(component.getSourceFile().getFilePath());

  component.insertProperties(
    0,
    constructorParams.map((param) => {
      const hasSelf = !!param.getDecorator('Self');
      const hasOptional = !!param.getDecorator('Optional');

      const options = [];

      if (hasOptional) [options.push('optional')];
      if (hasSelf) [options.push('self')];

      const params = options.length
        ? `, {${options.map((option) => `${option}: true`).join(', ')}}`
        : '';

      return {
        name: param.getName(),
        type: param.getTypeNode().getText(),
        isReadonly: param.isReadonly(),
        scope: param.getScope(),
        initializer: `inject(${
          param.getDecorator('Inject')?.getArguments()[0].getText() ??
          param.getTypeNode().getText()
        }${params})`,
      };
    })
  );

  constructorParams.forEach((param) => {
    param.remove();
  });

  console.log(component.getSourceFile().getText());
});

// Uncomment the next line once you are ready to save the changes
// saveActiveProject();

console.log(
  'Uncomment saveActiveProject function once you are ready to save...'
);
console.log('ng-morph ✅');

function fixInjectImport(file: string) {
  const angularCoreImports = getImports(file, {
    moduleSpecifier: '@angular/core',
  });

  editImports(angularCoreImports, (entity) => ({
    namedImports: [...entity.namedImports, 'inject'],
  }));
}
