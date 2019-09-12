import compile from '../src/compile';
import { getFilesInDir } from '../src/util';
import { network } from '../src/tracer';

describe('Test prism.', () => {
  test('Should get all dependencies of specific file 1', () => {
    const projectDir = `${__dirname}/fixtures/sample-project`;
    const filePath = `${__dirname}/fixtures/sample-project/core/index.ts`;
    const filePaths = getFilesInDir(projectDir);
    compile(filePaths, () => {});
    const imports = network.findImports(projectDir, filePath);
    expect(imports).toEqual([
      '/core/index.ts',
      '/core/a.ts',
      '/core/b.ts',
      '/core/c.ts',
      '/core/d.ts',
      '/core/e.ts',
    ]);
  });

  test('Should get all dependencies of specific file 2', () => {
    const projectDir = `${__dirname}/fixtures/sample-project`;
    const filePath = `${__dirname}/fixtures/sample-project/core/e.ts`;
    const filePaths = getFilesInDir(projectDir);
    compile(filePaths, () => {});
    const imports = network.findImports(projectDir, filePath);
    expect(imports).toEqual([
      '/core/e.ts',
      '/core/d.ts',
      '/core/c.ts',
      '/core/b.ts',
      '/core/a.ts'
    ]);
  });

  test('Should get all dependencies of specific file 3', () => {
    const projectDir = `${__dirname}/fixtures/sample-project`;
    const filePath = `${__dirname}/fixtures/sample-project/g.ts`;
    const filePaths = getFilesInDir(projectDir);
    compile(filePaths, () => {});
    const imports = network.findImports(projectDir, filePath);
    expect(imports).toEqual([
      '/g.ts',
      '/core/b.ts',
      '/core/a.ts',
      '/core/c.ts',
    ]);
  });
});
