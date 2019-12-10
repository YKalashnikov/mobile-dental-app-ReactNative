import React, { useState, useEffect } from 'react';
import { SectionList, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import Swipeable from 'react-native-swipeable-row';

import { Appointment, SectionTitle, PlusButton } from '../components';
import { appointmentsApi } from '../utils/api';

const HomeScreen = props => {
  const { navigation } = props;
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdateTime, setlastUpdateTime] = useState(null);

  const fetchAppointments = () => {
    setIsLoading(true);
    appointmentsApi
      .get()
      .then(({ data }) => {
        setData(data.data);
      })
      .finally(e => {
        setIsLoading(false);
      });
  };

  useEffect(fetchAppointments, []);

  useEffect(fetchAppointments, [navigation.state.params]);

  // TODO: Продумать удаление приемов
  const removeAppointment = id => {
    Alert.alert(
      'Удаление приема',
      'Вы действительно хотите удалить прием?',
      [
        {
          text: 'Отмена',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        {
          text: 'Удалить',
          onPress: () => {
            setIsLoading(true);
            appointmentsApi
              .remove(id)
              .then(() => {
                fetchAppointments();
              })
              .catch(() => {
                setIsLoading(false);
              });
          }
        }
      ],
      { cancelable: false }
    );
  };

  return (
    <Container>
      {data && (
        <SectionList
          sections={data}
          keyExtractor={item => item._id}
          onRefresh={fetchAppointments}
          refreshing={isLoading}
          renderItem={({ item }) => (
            <Swipeable
              rightButtons={[
                <SwipeViewButton style={{ backgroundColor: '#B4C1CB' }}>
                  <Ionicons name="md-create" size={28} color="white" />
                </SwipeViewButton>,
                <SwipeViewButton
                  onPress={removeAppointment.bind(this, item._id)}
                  style={{ backgroundColor: '#F85A5A' }}
                >
                  <Ionicons name="ios-close" size={48} color="white" />
                </SwipeViewButton>
              ]}
            >
              <Appointment navigate={navigation.navigate} item={item} />
            </Swipeable>
          )}
          renderSectionHeader={({ section: { title } }) => (
            <SectionTitle>{title}</SectionTitle>
          )}
        />
      )}
      <PlusButton onPress={navigation.navigate.bind(this, 'AddPatient')} />
    </Container>
  );
};

HomeScreen.navigationOptions = ({ navigation }) => ({
  title: 'Журнал приёмов',
  headerTintColor: '#2A86FF',
  headerStyle: {
    elevation: 0.8,
    shadowOpacity: 0.8
  },
  headerRight: () => (
    <TouchableOpacity
      onPress={navigation.navigate.bind(this, 'Patients')}
      style={{ marginRight: 20 }}
    >
      <Ionicons name="md-people" size={28} color="black" />
    </TouchableOpacity>
  )
});

const SwipeViewButton = styled.TouchableOpacity`
  width: 75px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Container = styled.View`
  flex: 1;
`;

export default HomeScreen;
