import React, { useEffect, useMemo, useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import styles from '../../styles/Module.module.scss';
import Exchange from '../Exchange';
import { MessageT } from '@/types';

const Module = ({ conversation }: { conversation: MessageT[] }) => {
  const [moduleName, setmoduleName] = useState('Loading....');

  useEffect(() => {
    const getModuleTitle = async () => {
      const response = await fetch(
        `/api/module?moduleId=${conversation[0].moduleId}`,
        {
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();
      if (data?.length > 0) setmoduleName(data[0]?.title);
      else  setmoduleName(data?.title);
      console.log(data, 'modd');

    };

    try {
      getModuleTitle();
    } catch (err) {
      console.log(err);
    }
  }, [conversation[0].moduleId]);

  return (
    <div>
      <Accordion
        className={styles.module}
        sx={{
          '& .MuiAccordion-region': {
            color: '#fff',
            backgroundColor: '#222638',
          },
          '& .MuiButtonBase-root': {
            color: '#fff',
            backgroundColor: '#222638',
          },
          '& .MuiPaper-root': {
            backgroundColor: '#222638',
          },
          '& .MuiAccordion-root': {
            backgroundColor: '#222638',
          },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel2-content'
          id='panel2-header'
        >
          {moduleName}
        </AccordionSummary>
        {conversation
          ?.sort((a, b) => a.sequence - b.sequence)
          .map((exchange) => {
            return (
              <div className={styles.exchange}>
                <Exchange conversation={exchange} isLoading={false} />
              </div>
            );
          })}
      </Accordion>
    </div>
  );
};

export default Module;
