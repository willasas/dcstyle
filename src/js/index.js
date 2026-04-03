
// 你的API密钥
const DEEPSEEK_API_KEY = '你的DeepSeek API密钥';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';

let currentConversation = [];
let isWaitingResponse = false;
let deepThinkEnabled = false;
let webSearchEnabled = false;
let currentAbortController = null;

const chatContainer = document.getElementById('messagesContainer');
const welcomeDiv = document.getElementById('welcomeScreen');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const newChatBtn = document.getElementById('newChatBtn');
const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menuToggle');
const deepThinkBtn = document.getElementById('deepThinkBtn');
const webSearchBtn = document.getElementById('webSearchBtn');
const inputWrapper = document.getElementById('inputWrapper');

// 更新发送按钮状态
function updateSendButtonState() {
  const hasText = messageInput.value.trim().length > 0;
  const isActive = !isWaitingResponse;

  if (hasText && isActive) {
    // 有内容且未在等待回复：启用按钮
    sendBtn.classList.remove('disabled');
    sendBtn.disabled = false;
  } else {
    // 无内容或正在等待回复：禁用按钮
    sendBtn.classList.add('disabled');
    sendBtn.disabled = true;
  }
}

// 监听输入框内容变化
messageInput.addEventListener('input', function () {
  autoResize(this);
  updateSendButtonState();
});

// 根据按钮显示状态调整输入框左侧内边距
function updateInputPadding() {
  if (deepThinkEnabled || webSearchEnabled) {
    inputWrapper.classList.add('has-options');
  } else {
    inputWrapper.classList.remove('has-options');
  }
}

function autoResize(textarea) {
  textarea.style.height = 'auto';
  let newHeight = Math.min(textarea.scrollHeight, 200);
  if (newHeight < 100) newHeight = 100;
  textarea.style.height = newHeight + 'px';
}

function scrollToBottom() {
  const messagesDiv = document.getElementById('chatMessages');
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>]/g, function (m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}

function formatMessageContent(content) {
  if (!content) return '';
  let formatted = escapeHtml(content);
  formatted = formatted.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
    return `<pre><code>${code.trim()}</code></pre>`;
  });
  formatted = formatted.replace(/\n/g, '<br>');
  return `<div class="message-content">${formatted}</div>`;
}

function renderMessages() {
  const allMsgNodes = Array.from(chatContainer.children).filter(child =>
    child.classList && child.classList.contains('message-item-wrapper')
  );
  allMsgNodes.forEach(node => node.remove());

  if (currentConversation.length === 0) {
    welcomeDiv.style.display = 'flex';
    return;
  }
  welcomeDiv.style.display = 'none';

  for (let idx = 0; idx < currentConversation.length; idx++) {
    const msg = currentConversation[idx];
    const isUser = msg.role === 'user';
    const messageWrapper = document.createElement('div');
    messageWrapper.className = `message-item-wrapper message ${isUser ? 'message-user' : 'message-ai'}`;
    messageWrapper.setAttribute('data-index', idx);

    const bubbleWrapper = document.createElement('div');
    bubbleWrapper.className = 'message-bubble-wrapper';
    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'message-bubble';
    bubbleDiv.innerHTML = formatMessageContent(msg.content);
    bubbleWrapper.appendChild(bubbleDiv);

    // 根据消息类型创建不同的操作栏
    const actionsDiv = createActionButtons(idx, isUser);
    bubbleWrapper.appendChild(actionsDiv);

    messageWrapper.appendChild(bubbleWrapper);
    chatContainer.appendChild(messageWrapper);
  }
  scrollToBottom();
}

// 根据消息类型创建操作栏：用户消息只显示复制，AI消息显示全部
function createActionButtons(messageIndex, isUser) {
  const actionsDiv = document.createElement('div');
  actionsDiv.className = 'message-actions';

  if (isUser) {
    // 用户消息：只显示复制按钮
    const copySpan = document.createElement('span');
    copySpan.className = 'action-icon';
    const copyIcon = document.createElement('span');
    copyIcon.className = 'material-symbols-outlined';
    copyIcon.innerText = 'content_copy';
    copySpan.appendChild(copyIcon);
    copySpan.addEventListener('click', (e) => {
      e.stopPropagation();
      handleMessageAction('copy', messageIndex, isUser);
    });
    actionsDiv.appendChild(copySpan);
  } else {
    // AI消息：显示全部5个图标
    const icons = [
      { name: 'content_copy', label: '复制', action: 'copy' },
      { name: 'refresh', label: '重新生成', action: 'regenerate' },
      { name: 'thumb_up', label: '喜欢', action: 'like' },
      { name: 'thumb_down', label: '不喜欢', action: 'dislike' },
      { name: 'share', label: '分享', action: 'share' }
    ];
    icons.forEach(icon => {
      const span = document.createElement('span');
      span.className = 'action-icon';
      const iconSpan = document.createElement('span');
      iconSpan.className = 'material-symbols-outlined';
      iconSpan.innerText = icon.name;
      span.appendChild(iconSpan);
      span.addEventListener('click', (e) => {
        e.stopPropagation();
        handleMessageAction(icon.action, messageIndex, isUser);
      });
      actionsDiv.appendChild(span);
    });
  }
  return actionsDiv;
}

function handleMessageAction(action, idx, isUser) {
  const msg = currentConversation[idx];
  if (!msg) return;
  switch (action) {
    case 'copy':
      navigator.clipboard.writeText(msg.content);
      showToast('已复制到剪贴板');
      break;
    case 'regenerate':
      if (isUser) {
        showToast('只有AI消息可以重新生成');
        return;
      }
      if (isWaitingResponse) return;
      let lastUserMsg = null;
      for (let i = idx - 1; i >= 0; i--) {
        if (currentConversation[i].role === 'user') {
          lastUserMsg = currentConversation[i];
          break;
        }
      }
      if (lastUserMsg) {
        currentConversation = currentConversation.slice(0, idx);
        renderMessages();
        sendMessageToAI(lastUserMsg.content);
      }
      break;
    case 'like':
      showToast('感谢反馈');
      break;
    case 'dislike':
      showToast('感谢反馈');
      break;
    case 'share':
      showToast('分享功能开发中');
      break;
  }
}

function showToast(msg) {
  const toast = document.createElement('div');
  toast.textContent = msg;
  toast.style.position = 'fixed';
  toast.style.top = '40px';
  toast.style.right = '2%';
  toast.style.transform = 'translateX(-50%)';
  toast.style.backgroundColor = '#333';
  toast.style.color = '#fff';
  toast.style.padding = '8px 16px';
  toast.style.borderRadius = '24px';
  toast.style.fontSize = '13px';
  toast.style.zIndex = '1000';
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 1500);
}

async function callDeepSeekStream(messages, onChunk, onComplete, onError) {
  currentAbortController = new AbortController();

  let systemContent = "你是一个智能AI助手，请友好、准确地回答用户问题。";
  if (deepThinkEnabled && webSearchEnabled) {
    systemContent = "你是一个智能AI助手，请开启深度思考模式并结合搜索信息回答。";
  } else if(deepThinkEnabled) {
    systemContent = "你是一个智能AI助手，请开启深度思考模式，仔细分析后回答。";
  } else if(webSearchEnabled) {
    systemContent = "你是一个智能AI助手，请结合搜索结果回答。";
  }

  const requestBody = {
    model: "deepseek-chat",
    messages: [
      { role: "system", content: systemContent },
      ...messages
    ],
    stream: true,
    temperature: 0.7,
    max_tokens: 4096
  };

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify(requestBody),
      signal: currentAbortController.signal
    });

    if (!response.ok) {
      throw new Error(`API错误: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullContent = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;
          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices[0]?.delta?.content || '';
            if (delta) {
              fullContent += delta;
              if (onChunk) onChunk(delta, fullContent);
            }
          } catch (e) {
            // 忽略解析错误
          }
        }
      }
    }
    if (onComplete) onComplete(fullContent);
  } catch (error) {
    if (error.name === 'AbortError') {
      if (onError) onError('用户停止了回答');
    } else {
      console.error('API Error:', error);
      if (onError) onError(error.message);
    }
  } finally {
    currentAbortController = null;
  }
}

function stopAnswer() {
  if (currentAbortController) {
    currentAbortController.abort();
    currentAbortController = null;
  }
  isWaitingResponse = false;
  sendBtn.classList.remove('stop-btn');
  updateSendButtonState();
}

async function sendMessageToAI(userText) {
  isWaitingResponse = true;
  sendBtn.classList.add('stop-btn');
  updateSendButtonState();

  // 准备API消息历史
  const apiMessages = currentConversation.map(msg => ({
    role: msg.role,
    content: msg.content
  }));

  // 添加AI消息占位符
  const aiMessageIndex = currentConversation.length;
  currentConversation.push({ role: 'assistant', content: '' });
  renderMessages();

  // 获取刚创建的AI气泡元素
  const messageWrappers = Array.from(chatContainer.querySelectorAll('.message-item-wrapper'));
  const aiWrapper = messageWrappers.find(w =>
    w.classList.contains('message-ai') &&
    parseInt(w.getAttribute('data-index')) === aiMessageIndex
  );

  let bubbleDiv = null;
  if (aiWrapper) {
    bubbleDiv = aiWrapper.querySelector('.message-bubble');
    bubbleDiv.innerHTML = '<div class="message-content"><span></span><span class="cursor-blink"></span></div>';
  }

  let streamContent = '';

  await callDeepSeekStream(
    apiMessages,
    (delta, fullContent) => {
      streamContent = fullContent;
      if (bubbleDiv) {
        const contentSpan = bubbleDiv.querySelector('.message-content span');
        if (contentSpan) {
          let formatted = escapeHtml(fullContent);
          formatted = formatted.replace(/\n/g, '<br>');
          contentSpan.innerHTML = formatted;
        }
        scrollToBottom();
      }
      if (currentConversation[aiMessageIndex]) {
        currentConversation[aiMessageIndex].content = fullContent;
      }
    },
    (fullContent) => {
      if (bubbleDiv) {
        bubbleDiv.innerHTML = formatMessageContent(fullContent);
      }
      if (aiWrapper) {
        const bubbleWrapper = aiWrapper.querySelector('.message-bubble-wrapper');
        const oldActions = bubbleWrapper.querySelector('.message-actions');
        if (oldActions) oldActions.remove();
        const newActions = createActionButtons(aiMessageIndex, false);
        bubbleWrapper.appendChild(newActions);
      }
      isWaitingResponse = false;
      sendBtn.classList.remove('stop-btn');
      updateSendButtonState();
      scrollToBottom();
    },
    (errorMsg) => {
      if (bubbleDiv) {
        bubbleDiv.innerHTML = formatMessageContent(`错误: ${errorMsg}`);
      }
      if (currentConversation[aiMessageIndex]) {
        currentConversation[aiMessageIndex].content = `错误: ${errorMsg}`;
      }
      if (aiWrapper) {
        const bubbleWrapper = aiWrapper.querySelector('.message-bubble-wrapper');
        const oldActions = bubbleWrapper.querySelector('.message-actions');
        if (oldActions) oldActions.remove();
        const newActions = createActionButtons(aiMessageIndex, false);
        bubbleWrapper.appendChild(newActions);
      }
      isWaitingResponse = false;
      sendBtn.classList.remove('stop-btn');
      updateSendButtonState();
      scrollToBottom();
    }
  );
}

async function sendMessage() {
  if (isWaitingResponse) {
    stopAnswer();
    return;
  }
  let text = messageInput.value.trim();
  if (text === '') return;
  messageInput.value = '';
  autoResize(messageInput);
  updateSendButtonState();
  currentConversation.push({ role: 'user', content: text });
  renderMessages();
  await sendMessageToAI(text);
}

function newConversation() {
  if (isWaitingResponse) {
    stopAnswer();
  }
  currentConversation = [];
  renderMessages();
  messageInput.value = '';
  autoResize(messageInput);
  updateSendButtonState();
  document.querySelectorAll('.history-item').forEach(item => item.classList.remove('active'));
}

function loadHistoryConversation(id) {
  if (isWaitingResponse) stopAnswer();
  if (id === '1') {
    currentConversation = [
      { role: 'user', content: '什么是DeepSeek？' },
      { role: 'assistant', content: 'DeepSeek 是一款先进的AI助手，由深度求索公司打造，擅长逻辑推理、编程和文本处理。我支持百万级上下文，可帮助解决复杂问题。有什么我可以帮你深入了解的吗？' }
    ];
  } else if (id === '2') {
    currentConversation = [
      { role: 'user', content: 'AI 如何辅助编程？' },
      { role: 'assistant', content: 'AI 可以帮助生成代码片段、解释复杂算法、调试错误以及编写单元测试。我能够支持多种编程语言，提供实时代码建议，提高开发效率。试试让我写一段网络请求代码吧！' }
    ];
  } else if (id === '3') {
    currentConversation = [
      { role: 'user', content: '给我一些创意写作灵感' },
      { role: 'assistant', content: '可以尝试：一个失去记忆的AI在废弃空间站醒来；或是时间旅行者发现自己才是历史灾难的起因。也可以写一封来自未来的信，描述地球生态奇迹般复苏的故事。需要具体展开吗？' }
    ];
  } else {
    newConversation();
    return;
  }
  renderMessages();
}

document.querySelectorAll('.history-item').forEach(item => {
  item.addEventListener('click', (e) => {
    const id = item.getAttribute('data-convo');
    document.querySelectorAll('.history-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    loadHistoryConversation(id);
    if (window.innerWidth <= 1024) {
      sidebar.classList.remove('open');
      menuToggle.classList.remove('active');
    }
  });
});

sendBtn.addEventListener('click', sendMessage);

messageInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    if (!sendBtn.disabled && !isWaitingResponse && messageInput.value.trim() !== '') {
      sendMessage();
    }
  }
});

newChatBtn.addEventListener('click', () => {
  newConversation();
  document.querySelectorAll('.history-item').forEach(i => i.classList.remove('active'));
  if (window.innerWidth <= 1024) {
    sidebar.classList.remove('open');
    menuToggle.classList.remove('active');
  }
});

deepThinkBtn.addEventListener('click', () => {
  deepThinkEnabled = !deepThinkEnabled;
  deepThinkBtn.classList.toggle('active', deepThinkEnabled);
  updateInputPadding();
});
webSearchBtn.addEventListener('click', () => {
  webSearchEnabled = !webSearchEnabled;
  webSearchBtn.classList.toggle('active', webSearchEnabled);
  updateInputPadding();
});

function toggleSidebar() {
  sidebar.classList.toggle('open');
  menuToggle.classList.toggle('active');
}

menuToggle.addEventListener('click', toggleSidebar);

window.addEventListener('resize', () => {
  if (window.innerWidth > 1024) {
    sidebar.classList.remove('open');
    menuToggle.classList.remove('active');
  }
});

const userInfoDiv = document.getElementById('userInfo');
userInfoDiv.addEventListener('click', () => {
  showToast("DeepSeek 体验模式");
  sidebar.classList.remove('open');
  menuToggle.classList.remove('active');
});

document.querySelectorAll('.footer-note a').forEach(link => {
  link.addEventListener('click', (e) => { e.preventDefault(); showToast("此为演示界面"); });
});

messageInput.style.height = '100px';
autoResize(messageInput);
updateInputPadding();
updateSendButtonState();