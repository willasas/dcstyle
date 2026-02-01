import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

// 工具类定义
interface UtilityClass {
  name: string;
  description: string;
  category: string;
  example: string;
}

// 读取工具类定义
function loadUtilityClasses(): UtilityClass[] {
  try {
    const completionsPath = path.join(__dirname, 'completions.json');
    const content = fs.readFileSync(completionsPath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Failed to load utility classes:', error);
    return [];
  }
}

// 创建补全项
function createCompletionItems(utilityClasses: UtilityClass[]): vscode.CompletionItem[] {
  return utilityClasses.map(utility => {
    const item = new vscode.CompletionItem(utility.name, vscode.CompletionItemKind.Property);
    item.detail = utility.category;
    item.documentation = new vscode.MarkdownString(`
# ${utility.name}

${utility.description}

## Example
\`\`\`html
${utility.example}
\`\`\`
    `);
    item.insertText = utility.name;
    return item;
  });
}

export function activate(context: vscode.ExtensionContext) {
  console.log('DC Style Intellisense extension activated');

  const utilityClasses = loadUtilityClasses();
  const completionItems = createCompletionItems(utilityClasses);

  // 注册补全提供程序
  const provider = vscode.languages.registerCompletionItemProvider(
    ['html', 'css', 'scss', 'vue', 'javascriptreact', 'typescriptreact'],
    {
      provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
        // 检查是否在类名或样式上下文中
        const linePrefix = document.lineAt(position).text.substring(0, position.character);

        // 检查是否在 class="" 或 className="" 中
        if (linePrefix.includes('class="') || linePrefix.includes("class='") ||
            linePrefix.includes('className="') || linePrefix.includes("className='")) {
          return completionItems;
        }

        // 检查是否在 CSS 类定义中
        if (linePrefix.includes('.')) {
          return completionItems;
        }

        return [];
      }
    },
    // 触发字符
    ' ' // 空格触发
  );

  context.subscriptions.push(provider);
}

export function deactivate() {
  console.log('DC Style Intellisense extension deactivated');
}
