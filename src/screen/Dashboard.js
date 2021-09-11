import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Animated, Dimensions, ScrollView, TouchableOpacity, Alert, FlatList } from 'react-native';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import normalize from 'react-native-normalize';
import { theme } from '../core/theme';
import MonthPicker from 'react-native-month-year-picker';
import { requestHandler } from '../services';
import Loader from "react-native-modal-loader";
import { API } from '../utils/url';
import { setUserToStore } from '../redux/action/user';
import AwesomeAlert from 'react-native-awesome-alerts';

const months = ["Jan", "Feb", "March", "April", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
const Dashboard = ({ navigation, user, setUser }) => {
  const { height, width } = Dimensions.get('screen');
  const [isLoading, setIsLoading] = useState(true);
  const [cardValue, setCardValue] = useState({
    income: 0,
    expense: 0,
    isLoading: false,
    balance: 0
  });
  const [tab, setTab] = useState('income');
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [alert, setAlert] = useState({
    visible: false,
    text: '',
    title: '',
    itemId: ''
  })
  const showPicker = useCallback((value) => setShow(value), []);
  const colors = ["#9164de", "#5f8ac2", "#c25f91", "#5f9c63", "#d49d46"]
  /**
   * Delete expense or income by id
   * @returns void
   */
  const deleteExpenseIncomeHandler = async () => {
    setIsLoading(true);
    let method = "PUT";
    let url = `${API}/${tab === "income" ? "income" : "expense"}/update/${user?._id}/${alert.itemId}`;
    let header = {
      'Authorization': `Bearer ${user?.jwtToken}`
    };
    let body = {
      isDeleted: true
    };
    let response = await requestHandler(url, body, header, method, navigation);
    setIsLoading(false);

    if (!response || response.data.success === false) {
      Alert.alert('Error', 'Something went wrong');
      return;
    } const reducer = async (accumulator, currentValue) => {
      return await accumulator + currentValue.price
    };
    if (tab === "income") {
      let newIncomes = user.incomes.filter(item => item._id !== alert.itemId);
      let totalIncomes = await newIncomes.reduce(reducer, 0);
      setCardValue({
        income: totalIncomes,
        incomes: newIncomes,
        balance: totalIncomes - user.expense
      })
      setUser({
        income: totalIncomes,
        incomes: newIncomes,
        balance: totalIncomes - user.expense
      })
    } else {
      let newExpense = user.expense.filter(item => item._id !== alert.itemId);
      let totalExpense = await newExpense.reduce(reducer, 0);
      setCardValue({
        expense: totalExpense,
        expense: totalExpense,
        balance: user.income - totalExpense
      })
      setUser({
        expense: totalExpense,
        expenses: newExpense,
        balance: user.income - totalExpense
      })
    }
    setAlert({
      visible: false,
      text: '',
      title: '',
      itemId: ''
    })
    setIsLoading(false);
  }

  /**
   * On Change on date update state
   */
  const onValueChange = async (event, newDate) => {
    const selectedDate = newDate || date;
    showPicker(false);

    setDate(selectedDate);
    var firstDay =
      new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);

    var lastDay =
      new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
    let method = "POST";
    let url = `${API}/user/info/${user?._id}`;
    let header = {
      'Authorization': `Bearer ${user?.jwtToken}`
    };
    let body = {
      firstDay: firstDay,
      lastDay: lastDay
    };
    const reducer = async (accumulator, currentValue) => {
      return await accumulator + currentValue.price
    };

    let response = await requestHandler(url, body, header, method, navigation);
    if (!response || response?.data?.success === false) {
      setIsLoading(false);
      Alert.alert('Error', 'Something Went Wrong');
    }
    const { data } = response;
    let totalExpense = await data.expenses.reduce(reducer, 0);
    let totalIncomes = await data.incomes.reduce(reducer, 0);
    setCardValue({
      income: totalIncomes,
      expense: totalExpense,
      balance: totalIncomes - totalExpense
    })
    setUser({
      income: (totalIncomes).toFixed(2),
      expense: totalExpense.toFixed(2),
      balance: (totalIncomes - totalExpense).toFixed(2),
      expenses: data.expenses,
      incomes: data.incomes,
      month: date.getMonth(),
    })
    setIsLoading(false);
  }


  /**
   * getting initial value for the card
   */
  const getCardValue = async () => {
    setIsLoading(true);
    var firstDay =
      new Date(date.getFullYear(), date.getMonth(), 1);

    var lastDay =
      new Date(date.getFullYear(), date.getMonth() + 1, 0);
    let method = "POST";
    let url = `${API}/user/info/${user?._id}`;
    let header = {
      'Authorization': `Bearer ${user?.jwtToken}`
    };
    let body = {
      firstDay: firstDay,
      lastDay: lastDay
    };
    const reducer = async (accumulator, currentValue) => {
      return await accumulator + currentValue.price
    };

    let response = await requestHandler(url, body, header, method, navigation);
    if (!response || response?.data?.success === false) {
      setIsLoading(false);
      Alert.alert('Error', 'Something Went Wrong');
    }
    const { data } = response;
    let totalExpense = await data.expenses.reduce(reducer, 0);
    let totalIncomes = await data.incomes.reduce(reducer, 0);
    setCardValue({
      income: totalIncomes,
      expense: totalExpense,
      balance: totalIncomes - totalExpense
    })
    setUser({
      income: (totalIncomes).toFixed(2),
      expense: totalExpense.toFixed(2),
      balance: (totalIncomes - totalExpense).toFixed(2),
      expenses: data.expenses,
      incomes: data.incomes,
      month: date.getMonth(),
    })
    setIsLoading(false);
  }

  /**
   * call getCardValue for first time
   */
  useEffect(() => {
    getCardValue();
  }, [])

  const greetingText = () => {
    let date = new Date();
    const hour = date.getHours();
    if (hour >= 5 && hour < 12) {
      return "Good morning";
    } else if (hour >= 12 && hour < 17) {
      return "Good afternoon";
    } else if ((hour >= 17 && hour <= 23) || hour < 5) {
      return "Good evening";
    }
  }

  return (
    <SafeAreaView style={{
      backgroundColor: theme.colors.white,
      flex: 1
    }}>
      <Loader loading={isLoading} color={theme.colors.primary} />

      <ScrollView style={{
        flex: 1,
        padding: normalize(18),
      }}
        showsVerticalScrollIndicator={false}
      >
        <AwesomeAlert
          show={alert.visible}
          showProgress={false}
          title={alert.title}
          message={alert.text}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          showConfirmButton={true}
          cancelText="No, cancel"
          confirmText="Yes, delete it"
          confirmButtonColor="#DD6B55"
          onCancelPressed={() => {
            setAlert({
              visible: false,
              text: ''
            })
          }}
          onConfirmPressed={() => {
            deleteExpenseIncomeHandler();
          }}
        />
        <Text
          style={{
            fontSize: normalize(24),
            fontWeight: "500",
            lineHeight: normalize(43.23)
          }}
        >
          Welcome Back {user?.name}
        </Text>
        <Text
          style={{
            fontWeight: "400",
            fontSize: normalize(21.12),
            color: "grey",
            marginBottom: normalize(20)
          }}
        >
          {greetingText()}
        </Text>
        <Animated.View style={styles.HomeBody}>
          <LinearGradient
            colors={[theme.colors.primary, "#7a91ff"]}
            style={[{ ...styles.Box, borderRadius: normalize(11), height: height / 3.7 }]}>
            <Text
              style={{
                textAlign: "center",
                color: theme.colors.white,
                fontSize: normalize(21),
                lineHeight: normalize(31.11)
              }}
            >{(Number(user?.balance)).toFixed(2) > 0 ? "Your Packet is left with" : "Crossing your limit this month"} </Text>
            <Text
              style={{
                fontSize: normalize(37.1),
                textAlign: "center",
                color: theme.colors.white,
                marginTop: normalize(5),
                marginBottom: normalize(15)
              }}
            >₹ {(Number(user?.balance)).toFixed(2)}</Text>
            <View
              style={{
                flexDirection: "row"
                , height: "55%"
                , justifyContent: "space-around",
                marginTop: normalize(15)
              }}
            >
              {show && (
                <MonthPicker
                  onChange={onValueChange}
                  value={date}
                  minimumDate={new Date(2020, 1)}
                  maximumDate={new Date()}
                  locale="en"
                />
              )}
              <TouchableOpacity
                onPress={() => showPicker(true)}
                style={{
                  backgroundColor: theme.colors.white,
                  width: normalize(100),
                  height: "65%",
                  borderRadius: normalize(12)
                }}
              >
                <Text
                  style={{
                    backgroundColor: "#b32b56",
                    color: theme.colors.white,
                    textAlign: "center",
                    borderTopRightRadius: normalize(12),
                    borderTopLeftRadius: normalize(12),
                    fontWeight: "600",
                    fontSize: normalize(17)
                  }}
                >{JSON.stringify(date.getFullYear())}</Text>
                <Text
                  style={{
                    fontSize: normalize(21),
                    textAlign: "center",
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    alignSelf: 'center',
                    marginTop: normalize(8)
                  }}
                >{months[(date.getMonth())]}</Text>
              </TouchableOpacity>
              <View
                style={{
                  height: "60%",
                  justifyContent: "space-between"
                }}
              >
                <View
                  style={{ flexDirection: "row", alignSelf: "center", justifyContent: "center", alignItems: "center", }}
                >

                  <Text
                    style={{
                      fontSize: normalize(20.2),
                      lineHeight: normalize(21.21),
                      color: theme.colors.white,

                    }}
                  >

                    Earned {Number(user?.income).toFixed(2)} ₹ </Text>
                </View>
                <Text
                  style={{
                    fontSize: normalize(19.2),
                    lineHeight: normalize(21.21),
                    color: theme.colors.white
                  }}
                >Spent {Number(user?.expense).toFixed(2)} ₹ </Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>
        <View
          style={{
            width: '100%',
            flexDirection: "row",
            marginVertical: normalize(15),
            justifyContent: "space-around"
          }}
        >
          <TouchableOpacity
            style={[
              tab === "expense" && {
                borderBottomColor: theme.colors.primary,
                borderBottomWidth: normalize(3),
                paddingBottom: normalize(15)
              },
              {
                flex: 1,
                alignItems: "center",
              }
            ]}
            disabled={isLoading}
            onPress={() => {
              setTab('expense');
            }}
          >
            <Text
              style={[
                tab === "expense" ? {
                  fontWeight: "500",
                  color: theme.colors.black
                } : {
                  color: "grey"
                },
                {
                  fontSize: normalize(18),
                  lineHeight: normalize(24.2),
                }
              ]}
            >
              Track your Expense
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={isLoading}
            style={[
              tab === "income" && {
                borderBottomColor: theme.colors.primary,
                borderBottomWidth: normalize(3),
                paddingBottom: normalize(15)
              },
              {
                flex: 1,
                alignItems: "center",
              }
            ]}
            onPress={() => {
              setTab('income');
            }}
          >
            <Text
              style={[
                tab === "income" ? {
                  fontWeight: "500",
                  color: theme.colors.black
                } : {

                  color: "grey"
                },
                {
                  fontSize: normalize(18),
                  lineHeight: normalize(24.2),
                }
              ]}
            >
              Track your Income
            </Text>
          </TouchableOpacity>
        </View>
        {user && isLoading === false && user[tab + "s"].length === 0 &&
          <View
            style={{
              height: normalize(90),
              alignItems: "center",
              justifyContent: "center", width: '100%'
            }}
          >
            <Text
              style={{
                color: theme.colors.black,
                fontWeight: "500",
                fontSize: normalize(19)
              }}
            >Oops Nothing to show!</Text>
          </View>
        }

        {user && isLoading === false && user[tab + "s"].map(item => {
          return (

            <TouchableOpacity
              key={item._id}
              onLongPress={() => {
                setAlert({
                  visible: true,
                  title: 'Delete Task',
                  text: 'Are you sure ?',
                  itemId: item._id
                })
              }}
              style={{
                // height: normalize(50),
                width: '98%',
                alignSelf: "center",
                backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                padding: normalize(15),
                flexDirection: "row",
                alignItems: 'center',
                elevation: 1,
                borderRadius: normalize(12),
                marginBottom: normalize(10)
              }}
            >
              <View
                style={{
                  flex: .7
                }}
              >
                <Text
                  style={{
                    fontSize: normalize(19),
                    lineHeight: normalize(26.3),
                    color: theme.colors.black
                  }}
                >{item.title}</Text>
                <Text
                  style={{
                    color: theme.colors.black,
                    fontSize: normalize(17),
                    fontWeight: "200"
                  }}
                >{item.description}</Text>
              </View>
              <View
                style={{
                  flex: .6
                }}
              >
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: normalize(26),
                    lineHeight: normalize(32.1),
                    color: theme.colors.white,
                    textAlign: "center"
                  }}
                >
                  ₹{item.price}
                </Text>
              </View>

            </TouchableOpacity>


          )
        })}
        <View style={{
          height: normalize(135)
        }}></View>
      </ScrollView>
    </SafeAreaView>
  );
};


const mapStateToProps = state => ({
  user: state.user,
});
const mapStateToDispatch = dispatch => ({
  setUser: (input) => dispatch(setUserToStore(input))
})
export default connect(mapStateToProps, mapStateToDispatch)(Dashboard);


const styles = StyleSheet.create({
  HomeBody: {
    width: '100%',
    alignSelf: "center",
    elevation: 1,
  },
  HomeHeader: {
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  container: {
    padding: normalize(17),
  },
  titleHeader: { fontSize: normalize(20), color: '#E9ECEF' },
  Box: {
    width: '100%',
    borderRadius: normalize(10),
    padding: normalize(10),
    elevation: 1,
    fontWeight: "500",
    lineHeight: normalize(39.12),
  },
});