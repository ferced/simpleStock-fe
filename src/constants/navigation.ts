import { NavItem } from '../types';
import { getEnabledNavigation } from '../config/navigation';

export const navigationItems: NavItem[] = getEnabledNavigation();
