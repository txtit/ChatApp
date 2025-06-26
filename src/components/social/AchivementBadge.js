import { Badge, Tooltip } from '@mui/material';
import { EmojiEvents } from '@mui/icons-material';

export default function AchievementBadge({ type }) {
    const colors = {
        gold: '#ffd700',
        silver: '#c0c0c0',
        bronze: '#cd7f32'
    };

    return (
        <Tooltip title="Huy hiệu vàng Toán học">
            <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                    <EmojiEvents sx={{ color: colors[type] || colors.gold }} />
                }
            >
                <Avatar src="/user-avatar.jpg" />
            </Badge>
        </Tooltip>
    );
}