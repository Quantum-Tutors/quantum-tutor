import React from 'react'
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import styles from '../../styles/Module.module.scss'
import UserQuery from '../UserQuery';
import ModelResponse from '../ModelResponse';
import ResponseAction from '../ResponseAction';

const Module = () => {
  return (
    <div>
      <Accordion className={styles.module} sx={{
        "& .MuiAccordion-region": {
          color: "#fff",
          backgroundColor:"#222638",
        },
        "& .MuiButtonBase-root": {
          color: "#fff",
          backgroundColor:"#222638",
        },
        "& .MuiPaper-root": {
          backgroundColor:"#222638",
        },
        "& .MuiAccordion-root": {
          backgroundColor:"#222638",
        },
      }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          Linked List
        </AccordionSummary>
        <div className={styles.exchange}>
          <UserQuery/>
          <ModelResponse/>
          <ResponseAction/>
        </div>
        <div className={styles.exchange}>
          <UserQuery/>
          <ModelResponse/>
          <ResponseAction/>
        </div>
      </Accordion>
    </div>
  );
}

export default Module;
