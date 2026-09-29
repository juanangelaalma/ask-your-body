import type {Atlas, SystemId} from '@/atlas/anatomy';
import {DEFAULT_VISIBLE, type SceneState} from '@/atlas/anatomy';
import {resolveStructure} from '@/anatomy/resolver';
import type {EmphasisRequest, FocusRequest} from '@/atlas/viewer-types';
import type {BodyAction, BodyScene} from '@/shared/types';

/** Everything the renderer needs. The executor only ever produces this shape. */
export interface ViewerState {
  scene: SceneState;
  focus: FocusRequest | null;
  emphasis: EmphasisRequest | null;
}

let focusSequence = 0;
let emphasisSequence = 0;

export function initialViewerState(): ViewerState {
  return {
    scene: {
      explode: 0,
      visible: [...DEFAULT_VISIBLE],
      selected: [],
      isolate: false,
      view: 'three-quarter',
      rotate: false,
      reset: 0,
    },
    focus: null,
    emphasis: null,
  };
}

export function requestFocus(parts: string[]): FocusRequest {
  return {id: ++focusSequence, parts};
}

export function requestEmphasis(strong: string[], context: number): EmphasisRequest | null {
  return strong.length ? {id: ++emphasisSequence, strong: [...new Set(strong)], context} : null;
}

/**
 * Actions carry a resolvable term, never a mesh id, so a grouped entry like "lungs"
 * still resolves to every part behind it.
 */
function partsForTerms(atlas: Atlas, terms: string[]): string[] {
  return [...new Set(terms.flatMap((term) => resolveStructure(atlas, term)?.partIds ?? []))];
}

function systemsForTerms(atlas: Atlas, terms: string[]): SystemId[] {
  const systems = new Set<SystemId>();
  for (const term of terms) {
    const structure = resolveStructure(atlas, term);
    if (structure) systems.add(structure.system);
  }
  return [...systems];
}

/** Applies one semantic action. Unknown or empty targets leave the state untouched. */
export function reduceAction(atlas: Atlas, state: ViewerState, action: BodyAction): ViewerState {
  switch (action.type) {
    case 'reset':
      return {
        ...initialViewerState(),
        scene: {...state.scene, visible: [...DEFAULT_VISIBLE], selected: [], isolate: false, explode: 0, reset: state.scene.reset + 1},
      };

    case 'focus': {
      const parts = partsForTerms(atlas, [action.target]);
      if (!parts.length) return state;
      return {...state, focus: requestFocus(parts)};
    }

    case 'highlight': {
      const parts = partsForTerms(atlas, [action.target]);
      if (!parts.length) return state;
      return {
        ...state,
        scene: {...state.scene, selected: [...new Set([...state.scene.selected, ...parts])]},
        emphasis: requestEmphasis([...(state.emphasis?.strong ?? []), ...parts], state.emphasis?.context ?? 1),
      };
    }

    case 'isolate': {
      const parts = partsForTerms(atlas, action.targets);
      if (!parts.length) return state;
      return {
        ...state,
        scene: {...state.scene, selected: parts, isolate: true, explode: 0},
        emphasis: requestEmphasis([...(state.emphasis?.strong ?? []), ...parts], state.emphasis?.context ?? 1),
      };
    }

    case 'show': {
      const systems = systemsForTerms(atlas, action.targets);
      if (!systems.length) return state;
      return {...state, scene: {...state.scene, visible: [...new Set([...state.scene.visible, ...systems])]}};
    }

    case 'hide': {
      const systems = new Set(systemsForTerms(atlas, action.targets));
      if (!systems.size) return state;
      const parts = new Set(partsForTerms(atlas, action.targets));
      return {
        ...state,
        scene: {
          ...state.scene,
          visible: state.scene.visible.filter((system) => !systems.has(system)),
          selected: state.scene.selected.filter((partId) => !parts.has(partId)),
        },
      };
    }

    case 'show_system':
      return {...state, scene: {...state.scene, visible: [...new Set([...state.scene.visible, action.system])]}};

    case 'hide_system':
      return {...state, scene: {...state.scene, visible: state.scene.visible.filter((system) => system !== action.system)}};

    case 'wait':
      return state;
  }
}

/**
 * Each scene starts from the default view, then applies its own actions, so a structure
 * highlighted in one scene is back to normal in the next.
 */
export function reduceScene(atlas: Atlas, state: ViewerState, scene: BodyScene): ViewerState {
  let next = reduceAction(atlas, state, {type: 'reset'});
  let focuses = 0;
  for (const action of scene.actions) {
    if (action.type === 'focus') focuses += 1;
    next = reduceAction(atlas, next, action);
  }
  const strong = next.emphasis?.strong?.length
    ? next.emphasis.strong
    : partsForTerms(atlas, scene.structures.map((structure) => structure.conceptId));
  // PRD 42: in focus mode the target stays at full strength and the surrounding anatomy
  // recedes to roughly a quarter, so an organ behind the ribs is still readable.
  return {...next, emphasis: requestEmphasis(strong, focuses > 0 ? 0.28 : 1)};
}
