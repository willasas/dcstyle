"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
// 读取工具类定义
function loadUtilityClasses() {
    try {
        const completionsPath = path.join(__dirname, 'completions.json');
        const content = fs.readFileSync(completionsPath, 'utf8');
        return JSON.parse(content);
    }
    catch (error) {
        console.error('Failed to load utility classes:', error);
        return [];
    }
}
// 创建补全项
function createCompletionItems(utilityClasses) {
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
function activate(context) {
    console.log('DC Style Intellisense extension activated');
    const utilityClasses = loadUtilityClasses();
    const completionItems = createCompletionItems(utilityClasses);
    // 注册补全提供程序
    const provider = vscode.languages.registerCompletionItemProvider(['html', 'css', 'scss', 'vue', 'javascriptreact', 'typescriptreact'], {
        provideCompletionItems(document, position) {
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
function deactivate() {
    console.log('DC Style Intellisense extension deactivated');
}
//# sourceMappingURL=extension.js.map