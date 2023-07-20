import React, { useState } from 'react';
import { View } from 'react-native';
import { Text, Tooltip } from '@rneui/themed';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from '../styles';

const ControlledTooltip = ({ children, popover }) => {
  const [open, setOpen] = useState(false);
  return (
    <Tooltip
      visible={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      popover={popover}
      backgroundColor="#e5e5e5"
    >
      {children}
    </Tooltip>
  );
};

const FieldLabel = ({ keyform = 0, lang = 'en', name, tooltip, translations }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const getTrans = (trans, target) => trans.find((t) => t?.language === target);

  let text = name;
  if (translations?.length) {
    const findTransText = getTrans(translations, lang);
    text = findTransText?.text || text;
  }
  const prefix = `${keyform + 1}. `;
  const labelText = prefix + text;

  let tooltipText = tooltip?.text;
  if (tooltip?.translations?.length) {
    const findTransTooltip = getTrans(tooltip.translations, lang);
    tooltipText = findTransTooltip?.text || tooltipText;
  }

  return (
    <View style={styles.fieldLabel}>
      <Text testID="field-label">{labelText}</Text>
      {tooltip && (
        <ControlledTooltip popover={<Text testID="field-tooltip-text">{tooltipText}</Text>}>
          <Icon name="help-circle" size={18} testID="field-tooltip-icon" />
        </ControlledTooltip>
      )}
    </View>
  );
};

export default FieldLabel;
