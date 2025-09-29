export function jsonToXML(jsonString: string): string {
  const obj = JSON.parse(jsonString);
  
  function objectToXML(obj: any, rootName: string = 'root'): string {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<${rootName}>\n`;
    
    function buildXML(obj: any, indent: string = '  '): string {
      let result = '';
      for (const key in obj) {
        const value = obj[key];
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          result += `${indent}<${key}>\n${buildXML(value, indent + '  ')}${indent}</${key}>\n`;
        } else if (Array.isArray(value)) {
          value.forEach(item => {
            result += `${indent}<${key}>${item}</${key}>\n`;
          });
        } else {
          result += `${indent}<${key}>${value}</${key}>\n`;
        }
      }
      return result;
    }
    
    xml += buildXML(obj);
    xml += `</${rootName}>`;
    return xml;
  }
  
  return objectToXML(obj);
}

export function yamlToJSON(yaml: string): string {
  // Simple YAML parser (handles basic key-value pairs)
  const lines = yaml.split('\n');
  const obj: any = {};
  let currentIndent = 0;
  let currentObj = obj;
  const stack: any[] = [obj];
  
  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    
    const indent = line.search(/\S/);
    const colonIndex = trimmed.indexOf(':');
    
    if (colonIndex > 0) {
      const key = trimmed.substring(0, colonIndex).trim();
      const value = trimmed.substring(colonIndex + 1).trim();
      
      if (value) {
        currentObj[key] = value;
      } else {
        currentObj[key] = {};
        stack.push(currentObj[key]);
        currentObj = currentObj[key];
      }
    }
  });
  
  return JSON.stringify(obj, null, 2);
}

export function jsonToYAML(jsonString: string): string {
  const obj = JSON.parse(jsonString);
  
  function objectToYAML(obj: any, indent: number = 0): string {
    let yaml = '';
    const spaces = '  '.repeat(indent);
    
    for (const key in obj) {
      const value = obj[key];
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        yaml += `${spaces}${key}:\n${objectToYAML(value, indent + 1)}`;
      } else if (Array.isArray(value)) {
        yaml += `${spaces}${key}:\n`;
        value.forEach(item => {
          yaml += `${spaces}  - ${item}\n`;
        });
      } else {
        yaml += `${spaces}${key}: ${value}\n`;
      }
    }
    return yaml;
  }
  
  return objectToYAML(obj);
}

export function tsvToCSV(tsv: string): string {
  return tsv.replace(/\t/g, ',');
}

export function csvToTSV(csv: string): string {
  return csv.replace(/,/g, '\t');
}

export function xmlToJSON(xml: string): string {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xml, 'text/xml');
  
  function xmlToObj(node: any): any {
    let obj: any = {};
    
    if (node.nodeType === 1) {
      if (node.attributes.length > 0) {
        obj['@attributes'] = {};
        for (let j = 0; j < node.attributes.length; j++) {
          const attribute = node.attributes.item(j);
          obj['@attributes'][attribute!.nodeName] = attribute!.nodeValue;
        }
      }
    } else if (node.nodeType === 3) {
      obj = node.nodeValue;
    }
    
    if (node.hasChildNodes()) {
      for (let i = 0; i < node.childNodes.length; i++) {
        const item = node.childNodes.item(i);
        const nodeName = item!.nodeName;
        if (typeof obj[nodeName] === 'undefined') {
          obj[nodeName] = xmlToObj(item);
        } else {
          if (typeof obj[nodeName].push === 'undefined') {
            const old = obj[nodeName];
            obj[nodeName] = [];
            obj[nodeName].push(old);
          }
          obj[nodeName].push(xmlToObj(item));
        }
      }
    }
    return obj;
  }
  
  const result = xmlToObj(xmlDoc);
  return JSON.stringify(result, null, 2);
}

export function htmlTableToCSV(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const table = doc.querySelector('table');
  
  if (!table) return '';
  
  const rows = Array.from(table.querySelectorAll('tr'));
  const csv = rows.map(row => {
    const cells = Array.from(row.querySelectorAll('td, th'));
    return cells.map(cell => {
      const text = cell.textContent || '';
      return text.includes(',') ? `"${text}"` : text;
    }).join(',');
  }).join('\n');
  
  return csv;
}
