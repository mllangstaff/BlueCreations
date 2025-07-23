/**
 * Widget Embed Code Generator Service
 * Generates concise embed codes for BlueCreations campaign widgets
 */

/**
 * Generate concise embed code for a campaign widget
 * @param {string} campaignName - Campaign name/identifier
 * @param {Object} options - Widget configuration options
 * @returns {string} Generated single-line script tag
 */
export function generateEmbedCode(campaignName, options = {}) {
  // Default configuration
  const defaults = {
    theme: 'light',
    size: 'medium',
    position: 'bottom-right',
    objective: '',
    brandName: ''
  };

  const config = { ...defaults, ...options };
  
  // Generate user ID for tracking
  const userId = `user_${Math.random().toString(36).substr(2, 9)}`;
  
  // Build parameters with proper URL encoding
  const params = [
    `campaignName=${encodeURIComponent(campaignName)}`,
    `userId=${userId}`,
    `theme=${config.theme}`,
    `size=${config.size}`,
    `position=${config.position}`,
    `objective=${encodeURIComponent(config.objective)}`,
    `brandName=${encodeURIComponent(config.brandName)}`
  ].join('&');

  // Generate single-line embed script (matches current CreateDialogueModal format)
  return `<script>(function(){var s=document.createElement('script');s.src='http://localhost:3002/widget?${params}';s.async=true;s.onerror=function(){console.error('Failed to load BlueCreations widget');};document.head.appendChild(s);})();</script>`;
}

/**
 * Generate user ID for widget tracking
 * @returns {string} Generated user ID
 */
export function generateUserId() {
  return `user_${Math.random().toString(36).substr(2, 9)}`;
}