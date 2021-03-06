import {ClsConfig} from "./dynamic-form-control.model";
import {DynamicFormValueControlModel, DynamicFormValueControlModelConfig} from "./dynamic-form-value-control.model";
import {serializable} from "../decorator/serializable.decorator";
import {getValue, serialize} from "../utils";

export interface DynamicFormOptionConfig<T> {

    disabled?: boolean;
    label?: string;
    value: T;
}

export class DynamicFormOption<T> {

    @serializable() disabled: boolean;
    @serializable() label: string | null;
    @serializable() value: T;

    constructor(config: DynamicFormOptionConfig<T>) {

        this.disabled = getValue(config, "disabled", false);
        this.label = getValue(config, "label", null);
        this.value = config.value;
    }

    get text() {
        return this.label;
    }

    set text(text: string) {
        this.label = text;
    }

    toJSON() {
        return serialize(this);
    }
}

export interface DynamicOptionControlModelConfig<T> extends DynamicFormValueControlModelConfig {

    options?: Array<DynamicFormOptionConfig<T>>;
}

export abstract class DynamicOptionControlModel<T> extends DynamicFormValueControlModel<T> {

    @serializable() options: Array<DynamicFormOption<T>>;

    constructor(config: DynamicOptionControlModelConfig<T>, cls?: ClsConfig) {

        super(config, cls);

        this.options = config.options ? config.options.map(optionConfig => new DynamicFormOption<T>(optionConfig)) : [];
    }

    get(index: number): DynamicFormOption<T> {
        return this.options[index];
    }

    select(index: number): void {
        this.valueUpdates.next(this.options[index].value);
    }
}