import React from 'react'
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import ArrowDown from '@mui/icons-material/Settings';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

const ModuleList = ({modules }: { expanded: Boolean, modules: Array<String> }) => {
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
                        primary={'ModuleList'}
                    />
                </ListItemButton>
            :
            <List>
                <ListItem>
                <ListItemButton onClick={()=>{setModuleListExpanded(!moduleListExpanded)}}>
                    <ListItemIcon>
                        <ArrowDropUpIcon />
                    </ListItemIcon>
                    <ListItemText
                        sx={{}}
                        primary={'ModuleList'}
                    />
                </ListItemButton>
                </ListItem >
            {modules.map((module) => (
                <ListItem>
                    <ListItemButton>
                    <ListItemIcon>
                        {
                            <ViewModuleIcon/>
                        }
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
