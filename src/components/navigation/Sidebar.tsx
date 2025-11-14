import {
  Box,
  Collapse,
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
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { navigationItems } from '../../constants/navigation';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useState } from 'react';

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
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (itemPath: string) => {
    setOpenMenus(prev => ({ ...prev, [itemPath]: !prev[itemPath] }));
  };

  const isPathActive = (path: string, children?: typeof navigationItems) => {
    if (location.pathname === path) return true;
    if (children) {
      return children.some(child => location.pathname === child.path);
    }
    return false;
  };

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
            const hasChildren = item.children && item.children.length > 0;
            const isActive = isPathActive(item.path, item.children);
            const isOpen = openMenus[item.path] ?? false;

            return (
              <Box key={item.path}>
                <ListItemButton
                  selected={isActive && !hasChildren}
                  onClick={() => {
                    if (hasChildren) {
                      toggleMenu(item.path);
                    } else {
                      navigate(item.path);
                      onClose();
                    }
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
                  {hasChildren ? (isOpen ? <ExpandLess /> : <ExpandMore />) : null}
                </ListItemButton>
                {hasChildren && (
                  <Collapse in={isOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {item.children!.map((child) => {
                        const isChildActive = location.pathname === child.path;
                        return (
                          <ListItemButton
                            key={child.path}
                            selected={isChildActive}
                            onClick={() => {
                              navigate(child.path);
                              onClose();
                            }}
                            sx={{
                              borderRadius: 2,
                              mx: 1,
                              my: 0.5,
                              pl: 7,
                              '&.Mui-selected': {
                                backgroundColor: 'rgba(44, 62, 155, 0.12)',
                                color: 'primary.main',
                              },
                            }}
                          >
                            <ListItemText primary={child.label} primaryTypographyProps={{ variant: 'body2' }} />
                          </ListItemButton>
                        );
                      })}
                    </List>
                  </Collapse>
                )}
              </Box>
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
