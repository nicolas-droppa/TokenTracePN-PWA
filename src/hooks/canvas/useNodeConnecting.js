import { usePetriStore } from '../../store/usePetriStore';
import { TOOLS, MOUSE_BUTTON } from '../../constants/tools';

export const useNodeConnecting = (node, onMouseDown) => {
  const selectedTool       = usePetriStore((s) => s.selectedTool);
  const connectingSourceId = usePetriStore((s) => s.connectingSourceId);
  const startConnecting    = usePetriStore((s) => s.startConnecting);
  const finishConnecting   = usePetriStore((s) => s.finishConnecting);
  const cancelConnecting   = usePetriStore((s) => s.cancelConnecting);
  const setSelectedElement = usePetriStore((s) => s.setSelectedElement);

  const sourceType = usePetriStore((s) => {
    if (!s.connectingSourceId) return null;
    return [...s.places, ...s.transitions]
      .find((n) => n.id === s.connectingSourceId)?.type ?? null;
  });

  const isConnectingSource = connectingSourceId === node.id;

  const isInvalidTarget =
    Boolean(sourceType) && !isConnectingSource && sourceType === node.type;

  const handleNodeClick = (e) => {
    e.stopPropagation();

    if (selectedTool === TOOLS.ARC) {
      if (!connectingSourceId) {
        startConnecting(node.id);
      } else if (isConnectingSource) {
        cancelConnecting();
      } else {
        finishConnecting(node.id);
      }
      return;
    }

    setSelectedElement(node);
  };

  const handleMouseDown = (e) => {
    if (e.button !== MOUSE_BUTTON.LEFT) return;
    if (isInvalidTarget) return;
    onMouseDown?.(e);
  };

  const containerProps = {
    className: `transition-colors duration-200 ${
      isInvalidTarget ? 'cursor-not-allowed' : 'cursor-grab active:cursor-grabbing'
    }`,
    onMouseDown: handleMouseDown,
    onClick: handleNodeClick,
    'data-element-id': node.id,
    'data-element-type': node.type,
  };

  return { isConnectingSource, isInvalidTarget, containerProps };
};