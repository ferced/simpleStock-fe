import MenuIcon from '@mui/icons-material/Menu';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import SearchIcon from '@mui/icons-material/Search';
import { Avatar, IconButton, InputAdornment, Stack, TextField, Tooltip, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

type TopbarProps = {
  onMenuClick: () => void;
};

export const Topbar = ({ onMenuClick }: TopbarProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      spacing={2}
      sx={{
        px: 3,
        py: 2,
        backgroundColor: 'background.paper',
        borderBottom: '1px solid #e2e8f0',
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2} sx={{ flex: 1 }}>
        {isMobile ? (
          <IconButton onClick={onMenuClick} color="primary">
            <MenuIcon />
          </IconButton>
        ) : null}
        <TextField
          size="small"
          placeholder="Buscar productos, clientes o facturas"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
      </Stack>
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Tooltip title="Notificaciones">
          <IconButton>
            <NotificationsNoneIcon />
          </IconButton>
        </Tooltip>
        <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}>MR</Avatar>
      </Stack>
    </Stack>
  );
};
