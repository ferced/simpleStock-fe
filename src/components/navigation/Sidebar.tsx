import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
  Avatar,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import * as Icons from '@mui/icons-material';
import { navigationItems } from '../../constants/navigation';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const drawerWidth = 264;

const BrandIcon = () => (
  <Avatar
    variant="rounded"
    sx={{
      width: 32,
      height: 32,
      bgcolor: 'rgba(18,163,184,0.12)',
      color: 'primary.main',
      border: '1px solid rgba(18,163,184,0.25)',
    }}
  >
    <TrendingUpIcon fontSize="small" />
  </Avatar>
);

const resolveIcon = (iconName?: string) => {
  if (!iconName) return null;
  const IconComponent = (Icons as Record<string, React.ElementType>)[iconName];
  return IconComponent ? <IconComponent fontSize="small" /> : null;
};

type SidebarProps = {
  mobileOpen: boolean;
  onClose: () => void;
};

export const Sidebar = ({ mobileOpen, onClose }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const content = (
    <Stack height="100%" justifyContent="space-between">
      <Box>
        <Stack direction="row" alignItems="center" spacing={1.5} px={2} py={3}>
          <BrandIcon />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1, letterSpacing: 0.5, color: 'primary.main' }}>
              SUMA
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', mt: -0.2, letterSpacing: 2, color: 'text.secondary' }}>
              GESTIÓN
            </Typography>
          </Box>
        </Stack>
        <Divider sx={{ mx: 2 }} />
        <List>
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItemButton
                key={item.path}
                selected={isActive}
                onClick={() => {
                  navigate(item.path);
                  onClose();
                }}
                sx={{
                  borderRadius: 2,
                  mx: 1,
                  my: 0.5,
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(44, 62, 155, 0.12)',
                    color: 'primary.main',
                  },
                }}
              >
                {item.icon ? <ListItemIcon sx={{ color: 'inherit' }}>{resolveIcon(item.icon)}</ListItemIcon> : null}
                <ListItemText primary={item.label} />
              </ListItemButton>
            );
          })}
        </List>
      </Box>
      <Box px={3} py={2}>
        <Typography variant="caption" color="text.secondary">
          © {new Date().getFullYear()} Suma Gestión. Administra tu inventario con claridad.
        </Typography>
      </Box>
    </Stack>
  );

  return (
    <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }} aria-label="navegación">
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {content}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {content}
      </Drawer>
    </Box>
  );
};
