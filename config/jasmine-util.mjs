export function addImports(config, imports) {
    return {...config, importMap: {...config.importMap, imports: {...config.importMap.imports, ...imports}}};
}