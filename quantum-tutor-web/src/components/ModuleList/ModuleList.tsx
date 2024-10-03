import React from 'react'
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import ArrowDown from '@mui/icons-material/Settings';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

const ModuleList = ({modules, closeNav, currentModel, setModel }: { closeNav: () => void, currentModel: string, setModel: (model: string)=> void, modules: Array<string> }) => {
    const [moduleListExpanded, setModuleListExpanded] = React.useState(false);
    
    return (
        <ListItem>
        { !moduleListExpanded ?
                <ListItemButton onClick={()=>{setModuleListExpanded(!moduleListExpanded)}}>
                    <ListItemIcon>
                        <ArrowDropDownIcon />
                    </ListItemIcon>
                    <ListItemText
                        sx={{}}
                        primary={'Select Model'}
                    />
                </ListItemButton>
            :
            <List sx={{display: "flex", flexDirection: "column"}}>
                <ListItem sx={{paddingBottom: "1px"}}>
                <ListItemButton onClick={()=>{setModuleListExpanded(!moduleListExpanded)}}>
                    <ListItemIcon>
                        <ArrowDropUpIcon />
                    </ListItemIcon>
                    <ListItemText
                        sx={{}}
                        primary={'Select Model'}
                    />
                </ListItemButton>
                </ListItem >
            {modules?.map((module) => (
                <ListItem sx={{boxShadow: module === currentModel ? "0 4px 15px rgba(159, 155, 155, 0.3)" : "none", paddingBottom: "1px", marginBottom: "0px", paddingTop: "1px"}}>
                    <ListItemButton onClick={()=> {
                        setModel(module)
                        closeNav();
                    }}>
                    <ListItemIcon>
                        <ViewModuleIcon/>
                    </ListItemIcon>
                    <ListItemText
                        sx={{}}
                        primary={module}
                    />
                </ListItemButton>
                </ListItem>
            ))}
            </List>
}        </ListItem>
        )
}

export default ModuleList
