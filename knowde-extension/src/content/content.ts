// Content script for Knowde extension
// Analyzes page content and provides learning opportunities

interface PageData {
  title: string;
  url: string;
  content: string;
  timestamp: number;
}

class KnowdeContentAnalyzer {
  private isActive: boolean = false;
  private highlightColor: string = "#404BD9";

  constructor() {
    this.init();
  }

  private async init() {
    // Get extension settings
    try {
      const result = await chrome.storage.local.get(["settings"]);
      const settings = result.settings || {};

      if (settings.autoCapture) {
        this.startAnalysis();
      }
    } catch (error) {
      console.error("Error initializing content script:", error);
    }

    // Listen for messages from background script
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      this.handleMessage(request, sender, sendResponse);
      return true; // Keep message channel open
    });

    // Listen for keyboard shortcuts
    document.addEventListener("keydown", (event) => {
      if (event.altKey && event.key === "k") {
        event.preventDefault();
        this.toggleLearningMode();
      }
    });
  }

  private handleMessage(request: any, sender: any, sendResponse: any) {
    switch (request.type) {
      case "ANALYZE_PAGE":
        this.analyzePage().then(sendResponse);
        break;
      case "TOGGLE_LEARNING_MODE":
        this.toggleLearningMode();
        sendResponse({ success: true });
        break;
      case "CAPTURE_SELECTION":
        this.captureSelection().then(sendResponse);
        break;
      default:
        sendResponse({ error: "Unknown message type" });
    }
  }

  private async analyzePage(): Promise<PageData> {
    const pageData: PageData = {
      title: document.title,
      url: window.location.href,
      content: this.extractTextContent(),
      timestamp: Date.now(),
    };

    // Send page data to background script for processing
    try {
      await chrome.runtime.sendMessage({
        type: "PAGE_ANALYZED",
        data: pageData,
      });
    } catch (error) {
      console.error("Error sending page data:", error);
    }

    return pageData;
  }

  private extractTextContent(): string {
    // Extract meaningful text content from the page
    const elementsToExtract = [
      "p",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "li",
      "article",
      "section",
    ];
    const textContent: string[] = [];

    elementsToExtract.forEach((tag) => {
      const elements = document.querySelectorAll(tag);
      elements.forEach((element) => {
        const text = element.textContent?.trim();
        if (text && text.length > 10) {
          textContent.push(text);
        }
      });
    });

    return textContent.join(" ").substring(0, 5000); // Limit to 5000 characters
  }

  private async captureSelection(): Promise<{
    text: string;
    success: boolean;
  }> {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();

    if (!selectedText) {
      return { text: "", success: false };
    }

    // Highlight the selected text
    this.highlightSelectedText(selection);

    // Save to storage
    try {
      const result = await chrome.storage.local.get(["highlights"]);
      const highlights = result.highlights || [];

      const newHighlight = {
        id: Date.now().toString(),
        text: selectedText,
        url: window.location.href,
        title: document.title,
        timestamp: Date.now(),
      };

      highlights.push(newHighlight);
      await chrome.storage.local.set({ highlights });

      // Send to background for processing
      chrome.runtime.sendMessage({
        type: "TEXT_CAPTURED",
        highlight: newHighlight,
      });

      return { text: selectedText, success: true };
    } catch (error) {
      console.error("Error capturing selection:", error);
      return { text: selectedText, success: false };
    }
  }

  private highlightSelectedText(selection: Selection | null) {
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const highlight = document.createElement("span");
    highlight.style.backgroundColor = this.highlightColor;
    highlight.style.color = "white";
    highlight.style.padding = "2px 4px";
    highlight.style.borderRadius = "3px";
    highlight.style.fontWeight = "bold";
    highlight.className = "knowde-highlight";

    try {
      range.surroundContents(highlight);
    } catch (error) {
      // Fallback for complex selections
      console.log("Could not highlight complex selection");
    }
  }

  private toggleLearningMode() {
    this.isActive = !this.isActive;

    if (this.isActive) {
      this.activateLearningMode();
    } else {
      this.deactivateLearningMode();
    }
  }

  private activateLearningMode() {
    // Add visual indicator that learning mode is active
    const indicator = document.createElement("div");
    indicator.id = "knowde-learning-indicator";
    indicator.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #404BD9, #60C2DA);
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        font-family: 'Inter', sans-serif;
        font-size: 14px;
        font-weight: 500;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(64, 75, 217, 0.3);
      ">
        🧠 Learning Mode Active
      </div>
    `;

    document.body.appendChild(indicator);

    // Enable text selection capturing
    document.addEventListener("mouseup", this.handleTextSelection);
  }

  private deactivateLearningMode() {
    const indicator = document.getElementById("knowde-learning-indicator");
    if (indicator) {
      indicator.remove();
    }

    // Disable text selection capturing
    document.removeEventListener("mouseup", this.handleTextSelection);
  }

  private handleTextSelection = () => {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();

    if (selectedText && selectedText.length > 10) {
      // Show quick action tooltip
      this.showQuickActionTooltip(selectedText);
    }
  };

  private showQuickActionTooltip(text: string) {
    // Remove existing tooltip
    const existingTooltip = document.getElementById("knowde-tooltip");
    if (existingTooltip) {
      existingTooltip.remove();
    }

    const tooltip = document.createElement("div");
    tooltip.id = "knowde-tooltip";
    tooltip.innerHTML = `
      <div style="
        position: absolute;
        background: white;
        border: 1px solid #E5E3E6;
        border-radius: 8px;
        padding: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10001;
        font-family: 'Inter', sans-serif;
        font-size: 12px;
      ">
        <button id="knowde-learn-more" style="
          background: #404BD9;
          color: white;
          border: none;
          padding: 4px 8px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        ">
          Learn More 🧠
        </button>
      </div>
    `;

    // Position near the selection
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      tooltip.style.left = `${rect.left + window.scrollX}px`;
      tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`;
    }

    document.body.appendChild(tooltip);

    // Add click handler
    const learnButton = document.getElementById("knowde-learn-more");
    if (learnButton) {
      learnButton.addEventListener("click", () => {
        this.captureSelection();
        tooltip.remove();
      });
    }

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (tooltip.parentNode) {
        tooltip.remove();
      }
    }, 5000);
  }

  private startAnalysis() {
    // Start analyzing the page content
    this.analyzePage();

    // Set up periodic analysis for dynamic content
    setInterval(() => {
      if (this.isActive) {
        this.analyzePage();
      }
    }, 30000); // Analyze every 30 seconds
  }
}

// Initialize the content analyzer
const knowdeAnalyzer = new KnowdeContentAnalyzer();

// Export for potential use
(window as any).knowdeAnalyzer = knowdeAnalyzer;
