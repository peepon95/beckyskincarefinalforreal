import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { Home, Search, List, User } from 'lucide-react-native';

export default function BottomNav({ activePage }) {
  const tabs = [
    {
      id: 'home',
      route: '/home',
      icon: Home,
      label: 'Dashboard',
    },
    {
      id: 'products',
      route: '/products',
      icon: Search,
      label: 'Products',
    },
    {
      id: 'routines',
      route: '/routines',
      icon: List,
      label: 'Routines',
    },
    {
      id: 'profile',
      route: '/profile',
      icon: User,
      label: 'Profile',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.navContent}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activePage === tab.id;

          return (
            <Link key={tab.id} href={tab.route} asChild>
              <TouchableOpacity style={styles.tab}>
                <Icon
                  color={isActive ? '#A8C8A5' : '#9CA3AF'}
                  size={24}
                  strokeWidth={2}
                />
                <Text
                  style={[
                    styles.label,
                    isActive ? styles.labelActive : styles.labelInactive,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            </Link>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#2C2C2C',
    height: 72,
    zIndex: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    paddingBottom: 0,
  },
  navContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 4,
  },
  label: {
    fontSize: 12,
    marginTop: 4,
  },
  labelActive: {
    color: '#A8C8A5',
    fontWeight: '600',
  },
  labelInactive: {
    color: '#9CA3AF',
    fontWeight: '400',
  },
});
