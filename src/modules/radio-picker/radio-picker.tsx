import * as React from 'react';
import classnames from 'classnames';
import Radios from '../../configs/radios';
import {RadioDefinition} from '../../configs/radio-config';

import styles from './radio-picker.module.css';

interface RadioItemProps {
    definition: RadioDefinition;
    isSelected: boolean;
    onSelect: (selected: RadioDefinition) => void;
}

function RadioItem({definition, isSelected, onSelect} : RadioItemProps) {
    const { identifiers, image } = definition;
    const name = identifiers.map(identifier => identifier.join(' ')).join(', ');
    
    const handleSelect = () => {
        onSelect(definition);
    };

    return (
        <div className={classnames(styles.radioItem,{[styles.isSelected]: isSelected})} onClick={handleSelect}>
            <img src={image} alt={name} />
            <p>{name}</p>
        </div>
    );
}

interface RadioPickerProps {
    selected?: RadioDefinition;
    onSelect?: (selected: RadioDefinition) => void;
}

export function RadioPicker({ selected, onSelect = () => {} } : RadioPickerProps) {
    return (
        <div className={styles.radioPickerList}>
            { Radios.map((definition) => <RadioItem key={definition.identifiers[0].join('-')} definition={definition} isSelected={definition === selected} onSelect={onSelect} />)}
        </div>
    )
}