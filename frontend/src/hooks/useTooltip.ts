import { useState } from 'react';

/**
 * Hook for managing tooltip visibility state
 * @returns Object with tooltip state and event handlers
 */
export const useTooltip = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  const showTooltipHandler = () => setShowTooltip(true);
  const hideTooltipHandler = () => setShowTooltip(false);

  return {
    showTooltip,
    onMouseEnter: showTooltipHandler,
    onMouseLeave: hideTooltipHandler
  };
};