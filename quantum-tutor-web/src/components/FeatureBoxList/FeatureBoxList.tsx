import { List, ListItem } from '@mui/material'
import React from 'react'
import styles from '../../styles/FeatureBoxList.module.scss';
import FeatureBox from '../FeatureBox/FeatureBox';
import { SvgIconComponent } from '@mui/icons-material';

interface FeatureBoxProps {
    text: string;
    Icon: SvgIconComponent;
  }
  
  interface FeatureBoxListProps {
    featureBoxList: FeatureBoxProps[];
  }

  const FeatureBoxList: React.FC<FeatureBoxListProps> = ({ featureBoxList }) => {
    return (
      <List className={styles.feature_box_list}>
        {featureBoxList.map((feature, index) => (
          <ListItem key={index}>
            <FeatureBox text={feature.text} Icon={feature.Icon} />
          </ListItem>
        ))}
      </List>
    );
  };

export default FeatureBoxList
