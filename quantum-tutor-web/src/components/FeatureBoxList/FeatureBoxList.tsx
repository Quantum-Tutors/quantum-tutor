import { List, ListItem } from '@mui/material';
import React, { useContext } from 'react';
import styles from '@/styles/FeatureBoxList.module.scss';
import FeatureBox from '../FeatureBox/FeatureBox';
import { SvgIconComponent } from '@mui/icons-material';
import { PromptContext } from '@/app/app/layout';

interface FeatureBoxProps {
  text: string;
  Icon: SvgIconComponent;
}

interface FeatureBoxListProps {
  featureBoxList: FeatureBoxProps[];
  setIsLoading: (loading: boolean) => void;
}

const FeatureBoxList: React.FC<FeatureBoxListProps> = ({
  featureBoxList,
  setIsLoading,
}) => {
  const dataContext = useContext(PromptContext);
  const { converse } = dataContext;

  return (
    <List className={styles.feature_box_list}>
      {featureBoxList.map((feature, index) => (
        <ListItem
          sx={{ cursor: 'pointer' }}
          key={index}
          onClick={() => {
            setIsLoading(true);
            converse('I want to learn' + feature.text);
          }}
        >
          <FeatureBox text={feature.text} Icon={feature.Icon} />
        </ListItem>
      ))}
    </List>
  );
};

export default FeatureBoxList;
