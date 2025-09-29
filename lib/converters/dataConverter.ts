import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export async function csvToJSON(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => resolve(JSON.stringify(results.data, null, 2)),
      error: reject,
    });
  });
}

export async function jsonToCSV(jsonString: string): Promise<Blob> {
  const data = JSON.parse(jsonString);
  const csv = Papa.unparse(data);
  return new Blob([csv], { type: 'text/csv' });
}

export async function xlsxToCSV(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  const csv = XLSX.utils.sheet_to_csv(firstSheet);
  return new Blob([csv], { type: 'text/csv' });
}

export async function csvToXLSX(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const worksheet = XLSX.utils.json_to_sheet(results.data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        resolve(new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
      },
      error: reject,
    });
  });
}

export async function xlsxToJSON(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  const json = XLSX.utils.sheet_to_json(firstSheet);
  return JSON.stringify(json, null, 2);
}

export async function jsonToXLSX(jsonString: string): Promise<Blob> {
  const data = JSON.parse(jsonString);
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  return new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}

export function base64Encode(text: string): string {
  return btoa(text);
}

export function base64Decode(base64: string): string {
  return atob(base64);
}

export function urlEncode(text: string): string {
  return encodeURIComponent(text);
}

export function urlDecode(encoded: string): string {
  return decodeURIComponent(encoded);
}

export function csvToXML(csvData: string): string {
  const lines = csvData.split('\n');
  const headers = lines[0].split(',');
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<root>\n';
  
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim()) {
      const values = lines[i].split(',');
      xml += '  <row>\n';
      headers.forEach((header, index) => {
        xml += `    <${header.trim()}>${values[index]?.trim() || ''}</${header.trim()}>\n`;
      });
      xml += '  </row>\n';
    }
  }
  xml += '</root>';
  return xml;
}

export function jsonToXML(jsonString: string): string {
  const data = JSON.parse(jsonString);
  
  function objectToXML(obj: any, rootName: string = 'root'): string {
    let xml = `<${rootName}>`;
    
    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        xml += objectToXML(item, 'item');
      });
    } else if (typeof obj === 'object' && obj !== null) {
      Object.keys(obj).forEach(key => {
        const value = obj[key];
        if (typeof value === 'object' && value !== null) {
          xml += objectToXML(value, key);
        } else {
          xml += `<${key}>${value}</${key}>`;
        }
      });
    } else {
      xml += obj;
    }
    
    xml += `</${rootName}>`;
    return xml;
  }
  
  return objectToXML(data);
}

export function xmlToJSON(xmlString: string): string {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
  
  function xmlToObject(node: Element): any {
    const obj: any = {};
    
    if (node.children.length === 0) {
      return node.textContent || '';
    }
    
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];
      const childName = child.nodeName;
      
      if (obj[childName]) {
        if (!Array.isArray(obj[childName])) {
          obj[childName] = [obj[childName]];
        }
        obj[childName].push(xmlToObject(child));
      } else {
        obj[childName] = xmlToObject(child);
      }
    }
    
    return obj;
  }
  
  const result = xmlToObject(xmlDoc.documentElement);
  return JSON.stringify(result, null, 2);
}

export function yamlToJSON(yamlString: string): string {
  // Simple YAML to JSON converter (basic implementation)
  const lines = yamlString.split('\n');
  const result: any = {};
  const stack: any[] = [result];
  let currentIndent = 0;
  
  for (const line of lines) {
    if (line.trim() === '') continue;
    
    const indent = line.search(/\S/);
    const content = line.trim();
    
    if (indent > currentIndent) {
      stack.push(stack[stack.length - 1]);
    } else if (indent < currentIndent) {
      stack.splice(indent / 2);
    }
    
    if (content.includes(':')) {
      const [key, ...valueParts] = content.split(':');
      const value = valueParts.join(':').trim();
      
      if (value === '') {
        stack[stack.length - 1][key] = {};
        stack.push(stack[stack.length - 1][key]);
      } else {
        stack[stack.length - 1][key] = value;
      }
    }
    
    currentIndent = indent;
  }
  
  return JSON.stringify(result, null, 2);
}

export function jsonToYAML(jsonString: string): string {
  const data = JSON.parse(jsonString);
  
  function objectToYAML(obj: any, indent: number = 0): string {
    const spaces = '  '.repeat(indent);
    let yaml = '';
    
    if (Array.isArray(obj)) {
      obj.forEach(item => {
        yaml += `${spaces}- ${typeof item === 'object' ? '\n' + objectToYAML(item, indent + 1) : item}\n`;
      });
    } else if (typeof obj === 'object' && obj !== null) {
      Object.keys(obj).forEach(key => {
        const value = obj[key];
        if (typeof value === 'object' && value !== null) {
          yaml += `${spaces}${key}:\n${objectToYAML(value, indent + 1)}`;
        } else {
          yaml += `${spaces}${key}: ${value}\n`;
        }
      });
    } else {
      yaml += `${spaces}${obj}\n`;
    }
    
    return yaml;
  }
  
  return objectToYAML(data);
}

