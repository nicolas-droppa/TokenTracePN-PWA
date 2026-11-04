import { usePetriStore } from '../../store/usePetriStore';
import { TOOLS, MOUSE_BUTTON, TOOL_ARC_TYPE } from '../../constants/tools';
import { useLongPress } from '../useLongPress';
import { ARC_TYPE } from '../../constants/net.js';

export const useNodeConnecting = (node, onMouseDown) => {
  const selectedTool        = usePetriStore((s) => s.selectedTool);
  const connectingSourceId  = usePetriStore((s) => s.connectingSourceId);
  const openInspector       = usePetriStore((s) => s.openInspector);
  const startConnecting     = usePetriStore((s) => s.startConnecting);
  const finishConnecting    = usePetriStore((s) => s.finishConnecting);
  const cancelConnecting    = usePetriStore((s) => s.cancelConnecting);
  const select              = usePetriStore((s) => s.select);
  const mode                = usePetriStore((s) => s.mode);

  const arcType = TOOL_ARC_TYPE[selectedTool];

  const sourceType = usePetriStore((s) => {
    if (!s.connectingSourceId) return null;
    return [...s.places, ...s.transitions]
      .find((n) => n.id === s.connectingSourceId)?.type ?? null;
  });

  const isConnectingSource = connectingSourceId === node.id;

  const isInvalidTarget =
    Boolean(sourceType) && !isConnectingSource && sourceType === node.type;

  const isInvalidSource =
    !connectingSourceId && Boolean(arcType) && arcType !== ARC_TYPE.REGULAR && node.type === 'transition';

  const handleNodeClick = (e) => {
    e.stopPropagation();

    if (selectedTool === TOOL_ARC_TYPE[selectedTool]) {
      if (!connectingSourceId) {
        if ((arcType !== ARC_TYPE.REGULAR) && (node.type === 'transition')) return;
        startConnecting(node.id);

      } else if (isConnectingSource) {
        cancelConnecting();

      } else {
        finishConnecting(node.id, TOOL_ARC_TYPE[selectedTool]);
      }
      return;
    }

    select(node.id);
  };

  const handleMouseDown = (e) => {
    if (e.button !== MOUSE_BUTTON.LEFT) return;
    if (isInvalidTarget) return;
    onMouseDown?.(e);
  };

  const longPress = useLongPress(() => openInspector(node.id));

  const cursorClass =
    mode === 'run'
      ? 'cursor-default'
      : isInvalidTarget || isInvalidSource
        ? 'cursor-not-allowed'
        : 'cursor-grab active:cursor-grabbing';

  const containerProps = {
    className: `transition-colors duration-200 ${cursorClass}`,
    onMouseDown: handleMouseDown,
    onClick: handleNodeClick,
    onDoubleClick: (e) => {
      e.stopPropagation();
      if (mode === 'run' && node.type === 'transition') return;
      openInspector(node.id);
    },
    'data-element-id': node.id,
    'data-element-type': node.type,
    ...longPress,
  };

  return { isConnectingSource, isInvalidTarget, containerProps, isInvalidSource };
};
