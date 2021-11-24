import React, { useEffect, useState, useCallback } from 'react';
import { Alert, Image, KeyboardAvoidingView, SafeAreaView, ScrollView, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { requestHandler } from '../services';
import { API } from '../utils/url';
import { theme } from '../core/theme'
import Loader from "react-native-modal-loader";
import { setAllExpensesCategories, setAllIncomeCategories } from '../redux/action/category';
import normalize from 'react-native-normalize';
import Icon from 'react-native-vector-icons/AntDesign';
import { FakeCurrencyInput } from 'react-native-currency-input';
import { TextInput, List } from 'react-native-paper';
import { setUserToStore } from '../redux/action/user';
import {Picker} from '@react-native-picker/picker';
import MonthPicker from 'react-native-month-year-picker';

const months = ["Jan", "Feb", "March", "April", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];


const AddTransaction = ({
  navigation,
  user,
  setExpenseCategories,
  setIncomeCategories,
  category,
  setUser,
}) => {
  const [visible, setVisible] = useState('expenses');
  const [isLoading, setIsLoading] = useState(false);
  const [price, setPrice] = useState(0);
  const [categoryItems, setCategoryItems] = useState([]);
  const [value, setValue] = useState(null);
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date());


  useEffect(async () => {
    try {
      let method = "GET";
      let url_expense = `${API}/category/expense/${user?._id}`;
      let url_income = `${API}/category/income/${user?._id}`;
      let header = {
        'Authorization': `Bearer ${user?.jwtToken}`
      };
      let body = null;
      setIsLoading(true);
      let response_expense = await requestHandler(url_expense, body, header, method, navigation);
      let response_income = await requestHandler(url_income, body, header, method, navigation);
      setIsLoading(false);
      setExpenseCategories(response_expense?.data);
      setIncomeCategories(response_income?.data);
      let arr = visible === "incomes" ? response_income?.data.categories : response_expense?.data.categories
      arr = arr.map(item => {
        return {
          label: item.category,
          value: item.category,
          icon: () => <Image source={{ uri: item.icon }} style={{
            padding: 4, height: 50, width: 50
          }} />
        }
      });
      setCategoryItems([...arr]);
    } catch (error) {
      setIsLoading(false);
      console.log('-----------------------------------Add Transaction Line 15-------------------------------------');
      console.log(error);
    }
  }, []);
  const switchMode = () => {
    if (visible === "expenses") {
      setVisible("incomes");
    } else {
      setVisible("expenses");
    }
    if (category) {
      let arr = category[visible !== "incomes" ? "incomeCategories" : "expenseCategories"].map(item => {
        return {
          label: item.category,
          value: item.category,
        }
      });
      let newArray = [{label: "Select Category"}].concat(arr);
      setCategoryItems([...newArray]);
    }
  }

  const addTransaction = async () => {
    if (title.length === 0) {
      ToastAndroid.show('Enter Title to Continue.', ToastAndroid.SHORT);
      return;
    }
    if(value === undefined || value === null || value.length === 0 || value === "Select Category"){
      ToastAndroid.show('Choose Category to Continue.', ToastAndroid.SHORT);
      return;
    }
    setIsLoading(true);
    let method = "POST";
    let url = `${API}/${visible === "incomes" ? "income" : "expense"}/add/${user?._id}`;
    let header = {
      'Authorization': `Bearer ${user?.jwtToken}`
    };

    let body = {
      title: title,
      description: description,
      category: value,
      price: price,
      user: user._id,
      createdAt: date
    };
    if (!body.category) {
      ToastAndroid.show('Mention Category to Continue.', ToastAndroid.SHORT);
      setIsLoading(false);
      return;
    }
    if (body.price === 0 && body.price <= 100000) {
      Alert.alert('Error', 'Enter a Valid Price.')
      setIsLoading(false);
      return;
    }
    let response = await requestHandler(url, body, header, method, navigation);
    let { data } = response;
    if (data.success === true) {
      setTitle('');
      setDescription('');
      setPrice('0');
      setValue('');
      Alert.alert('Success', "Added Successfully");
      const reducer = async (accumulator, currentValue) => {
        return await accumulator + currentValue.price
      };
      let date = new Date()
      if (date.getMonth() === user.month) {
        if (visible === "expenses") {
          let arr = user.expenses;
          arr.push(data.expense);
          let totalExpense = await user.expenses.reduce(reducer, 0);
          let newBalance = user.income - totalExpense;
          setUser({ expenses: arr, expense: totalExpense, balance: newBalance })
        } else {
          let arr = user.incomes;
          arr.push(data.income);
          let totalIncomes = await user.incomes.reduce(reducer, 0);
          let newBalance = totalIncomes - user.expense;
          setUser({ incomes: arr, income: totalIncomes, balance: newBalance })
        }
      }

    } else {
      Alert.alert('Error', "something went wrong")
    }
    setIsLoading(false);

  }

  const [show, setShow] = useState(false);

  const showPicker = useCallback((value) => setShow(value), []);
  const onValueChange = useCallback(
    (event, newDate) => {
      const selectedDate = newDate || date;
      showPicker(false);
      setDate(selectedDate);
    },
    [date, showPicker],
  );
  return (
    <SafeAreaView 
      style={{
        flex: 1,
        backgroundColor: theme.colors.background
      }}
    >
      <KeyboardAvoidingView
        style={{
          flex: 1,
          
        }}
      >
        <Text
          style={{
            color: "gray",
            fontSize: normalize(22),
            lineHeight: normalize(30),
            // marginVertical: normalize(10),
            width: '90%',
            marginTop: normalize(20),
            alignSelf: "center"
          }}
        >
          Start Tracking Your Hard works.
        </Text>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            backgroundColor: theme.colors.background,
            padding: normalize(15)
          }}
          style={{
            flex: 1,
          }}
        >
          {/* <DatePicker
            modal
            open={openDate}
            date={date}
            onConfirm={(date) => {
              setOpenDate(false)
              setDate(date)
            }}
            onCancel={() => {
              setOpenDate(false)
            }}
          /> */}
          {/* {show && (
            <MonthPicker
              onChange={onValueChange}
              value={date}
              minimumDate={new Date(2020, 1)}
              maximumDate={new Date()}
              locale="en"
            />
          )} */}
          <Loader loading={isLoading} color={theme.colors.primary} />
          {/* <TouchableOpacity
            onPress={() => {
              setShow(true)
            }}
            style={{
            backgroundColor: theme.colors.white,
            padding: normalize(10),
            width : '90%',
            alignSelf : "center",
            marginTop: normalize(15),
            borderRadius: normalize(12),
            elevation: 1,
            flexDirection: "row",
            alignItems: "center"
            }}
          >
            <Text
              style={{
                fontSize: normalize(19),
                fontWeight: "600",
                textTransform: "uppercase"
              }}
            >{months[date.getMonth()] }{" "}{date.getFullYear()}</Text>
            <List.Icon icon="archive-arrow-down" color={theme.colors.primary} />
          </TouchableOpacity> */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginTop: normalize(15)
            }}
          >
            <Text
              style={{
                fontSize: normalize(21),
                lineHeight: normalize(36.14),
                color: theme.colors.black,
                marginRight: normalize(15),
                textTransform: "capitalize",

              }}
            >
              Add {visible}
            </Text>
            <TouchableOpacity
              onPress={switchMode}
              style={{
                backgroundColor: theme.colors.primary,
                padding: normalize(10),
                borderRadius: normalize(12)
              }}
            >
              <Icon name="retweet" size={22} color={theme.colors.white} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              backgroundColor: theme.colors.primary,
              width: '100%',
              alignSelf: "center",
              borderRadius: normalize(5),
              marginTop: normalize(15),
              padding: normalize(15)
            }}
          >
            <FakeCurrencyInput
              value={price}
              onChangeValue={setPrice}
              prefix="₹ "
              delimiter=","
              separator="."
              precision={2}
              style={{
                fontSize: normalize(22),
                color: theme.colors.white,
                lineHeight: normalize(36.8),
              }}
              placeholder="Enter the price"
              placeholderTextColor="white"
              onChangeText={(formattedValue) => {
                // setPrice(formattedValue)
              }}
            />
          </View>
          <Text
            style={{
              color: theme.colors.black,
              fontSize: normalize(14),
              lineHeight: normalize(24.1),
              alignSelf: "center",
              width: '100%'
            }}
          >
            Enter the amount in rupees above.
          </Text>
          <TextInput
            value={title}
            maxLength={10}
            onChangeText={text => setTitle(text)}
            label="Title"
            placeholder="Electricity bills, Stipend"
            mode="outlined"
            style={{
              backgroundColor: theme.colors.white,
              width: '100%',
              alignSelf: "center",
              borderWidth: 0,
              borderColor: theme.colors.background,
              marginVertical: normalize(10)
            }}

          />
          <TextInput
            maxLength={35}
            value={description}
            placeholder="Hostel Electricity bills, Freelance Project"

            onChangeText={text => {
              setDescription(text)
            }}
            mode="outlined"
            style={{
              backgroundColor: theme.colors.white,
              width: '100%',
              alignSelf: "center",
              borderWidth: 0,
              borderColor: theme.colors.background,
              marginVertical: normalize(10)
            }}
            multiline={true}
            numberOfLines={5}
            label="Description"
          />
  
          <Picker
            style={{
              backgroundColor: "white",
              margin: 2,
              borderRadius: normalize(12),
              borderBottomColor: "gray",
              borderBottomWidth: 0.5,
              height: normalize(50),
              width: "100%",
              alignSelf: "center",
            }}
            disabled={true}
            selectedValue={value}
            onValueChange={(itemValue, itemIndex) => {
              setValue(itemValue);
            }}
          >
            {categoryItems.map(item => {
              return (
                <Picker.Item label={item.label} value={item.label} />
              )
            })}
          </Picker>

          <TouchableOpacity
            style={{
              width: "100%",
              alignSelf: "center",
              backgroundColor: theme.colors.white,
              padding: normalize(4),
              borderRadius: normalize(4),
              height: normalize(55),
              borderRadius: normalize(5),
              justifyContent: "center",
              marginTop: normalize(10),
              borderWidth: 1,
              borderColor: theme.colors.primary,
              elevation: 2
            }}
            disabled={isLoading}
            onPress={addTransaction}
          >
            <Text
              style={{
                color: theme.colors.primary,
                textAlign: "center",
                fontSize: normalize(19),
                lineHeight: normalize(30.22),
                fontWeight: "500",
              }}
            >
              Add {visible === "incomes" ? "Income" : "Expense"
              }
            </Text>
          </TouchableOpacity>
          <View style={{
            height: normalize(120),
          }} />
        </ScrollView>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};


const mapStateToProps = state => ({
  user: state.user,
  category: state.category
});

const mapDispatchToProps = dispatch => ({
  setExpenseCategories: category => dispatch(setAllExpensesCategories(category)),
  setIncomeCategories: category => dispatch(setAllIncomeCategories(category)),
  setUser: data => dispatch(setUserToStore(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(AddTransaction);