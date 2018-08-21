import { ActionType } from '../Abstract/ActionElement';
import { OpenUrlActionElement } from '../Actions/OpenUrlAction';
import { SelectActionElement } from '../Actions/SelectAction';
import { ShowCardActionElement } from '../Actions/ShowCardAction';
import { SubmitActionElement } from '../Actions/SubmitAction';
export class ActionFactory {
    static create(json, parent) {
        if (!json) {
            return undefined;
        }
        let action;
        switch (json.type) {
            case ActionType.OpenUrl:
                action = new OpenUrlActionElement(json, parent);
                break;
            case ActionType.Submit:
                action = new SubmitActionElement(json, parent);
                break;
            case ActionType.ShowCard:
                action = new ShowCardActionElement(json, parent);
                break;
            case ActionType.Select:
                action = new SelectActionElement(json, parent);
                break;
            default:
                action = undefined;
                break;
        }
        return action;
    }
    static createSet(json, parent) {
        let actionSet = [];
        if (json && json.length > 0) {
            json.forEach((item) => {
                let action = ActionFactory.create(item, parent);
                if (action && action.isValid) {
                    actionSet.push(action);
                }
            });
        }
        return actionSet;
    }
}
