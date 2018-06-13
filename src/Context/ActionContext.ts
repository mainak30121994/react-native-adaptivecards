import { OpenUrlActionElement } from '../Schema/Actions/OpenUrlAction';
import { ShowCardActionElement } from '../Schema/Actions/ShowCardAction';
import { SubmitActionElement } from '../Schema/Actions/SubmitAction';
import { ActionElement, ActionType } from '../Schema/Base/ActionElement';
import { CardElement } from '../Schema/Base/CardElement';

export class ActionEventHandlerArgs<T extends ActionElement> {
    formData?: { [id: string]: string };
    action: T;
}

export class ActionContext {
    private static sharedInstance: ActionContext;
    private onOpenUrl: (args: ActionEventHandlerArgs<OpenUrlActionElement>) => void;
    private onShowCard: (args: ActionEventHandlerArgs<ShowCardActionElement>) => void;
    private onSubmit: (args: ActionEventHandlerArgs<SubmitActionElement>) => void;

    private constructor() { }

    public static getInstance() {
        if (ActionContext.sharedInstance === undefined) {
            ActionContext.sharedInstance = new ActionContext();
        }
        return ActionContext.sharedInstance;
    }

    public registerOpenUrlHandler(handler: (args: ActionEventHandlerArgs<OpenUrlActionElement>) => void) {
        this.onOpenUrl = handler;
    }

    public registerShowCardHandler(handler: (args: ActionEventHandlerArgs<ShowCardActionElement>) => void) {
        this.onShowCard = handler;
    }

    public registerSubmitHandler(handler: (args: ActionEventHandlerArgs<SubmitActionElement>) => void) {
        this.onSubmit = handler;
    }

    public getActionEventHandler() {
        return (
            target: CardElement,
            ...hooks: ((args: ActionEventHandlerArgs<ActionElement>) => ActionEventHandlerArgs<ActionElement>)[]
        ) => {
            let callback: (args: ActionEventHandlerArgs<ActionElement>) => void;
            let action = target.getAction();
            if (action) {
                switch (action.type) {
                    case ActionType.OpenUrl:
                        callback = this.onOpenUrl;
                        break;
                    case ActionType.ShowCard:
                        callback = this.onShowCard;
                        break;
                    case ActionType.Submit:
                        callback = this.onSubmit;
                        break;
                }
                let args = {
                    action: action
                };
                if (hooks) {
                    hooks.reduce((prev, current) => {
                        return current(prev);
                    }, args);
                }
                if (callback && typeof callback === 'function') {
                    callback(args);
                }
            }
        };
    }
}