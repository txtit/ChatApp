import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { Home, Person, School, SportsEsports, Chat } from '@mui/icons-material';
import React from 'react';
export default function Navigation() {
    const [value, setValue] = React.useState(0);

    return (
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
            <BottomNavigation
                showLabels
                value={value}
                onChange={(event, newValue) => setValue(newValue)}
            >
                <BottomNavigationAction label="Trang chủ" icon={<Home />} />
                <BottomNavigationAction label="Học tập" icon={<School />} />
                <BottomNavigationAction label="Trò chơi" icon={<SportsEsports />} />
                <BottomNavigationAction label="Chat" icon={<Chat />} />
                <BottomNavigationAction label="Tôi" icon={<Person />} />
            </BottomNavigation>
        </Paper>
    );
}
