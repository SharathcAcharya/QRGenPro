// Simple loader to help bypass native dependency issues
export async function resolve(specifier, context, nextResolve) {
  // Bypass problematic native modules
  if (specifier.includes('@rollup/rollup-win32-x64-msvc')) {
    return {
      shortCircuit: true,
      url: new URL('./mock-rollup.mjs', import.meta.url).href
    };
  }
  
  if (specifier.includes('@esbuild/win32-x64')) {
    return {
      shortCircuit: true,
      url: new URL('./mock-esbuild.mjs', import.meta.url).href
    };
  }
  
  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  if (url.includes('mock-rollup.mjs') || url.includes('mock-esbuild.mjs')) {
    return {
      format: 'module',
      shortCircuit: true,
      source: 'export default () => {};'
    };
  }
  
  return nextLoad(url, context);
}
