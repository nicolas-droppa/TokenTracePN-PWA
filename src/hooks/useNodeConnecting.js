import { usePetriStore } from '../store/usePetriStore';

export const useNodeConnecting = (node, onMouseDown) => {
  const {
    places,
    transitions,
    selectedTool,
    connectingSourceId,
    startConnecting,
    finishConnecting,
    cancelConnecting,
    setSelectedElement,
  } = usePetriStore();

  const isConnectingSource = connectingSourceId === node.id;

  const isSourcePlace = places.some((p) => p.id === connectingSourceId);
  const isCurrentPlace = places.some((p) => p.id === node.id);

  const isInvalidTarget =
    Boolean(connectingSourceId) && !isConnectingSource && isSourcePlace === isCurrentPlace;

  const handleNodeClick = (e) => {
    e.stopPropagation();

    if (selectedTool === 'arc') {
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

  const containerProps = {
    className: `transition-colors duration-200 ${
      isInvalidTarget ? 'cursor-not-allowed' : 'cursor-grab active:cursor-grabbing'
    }`,
    onMouseDown: isInvalidTarget ? undefined : onMouseDown,
    onClick: handleNodeClick,
  };

  return {
    isConnectingSource,
    isInvalidTarget,
    containerProps,
  };
};