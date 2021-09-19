import React, { useEffect, useRef, useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, SafeAreaView, ScrollView, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import { requestHandler } from '../services';
import { API } from '../utils/url';
import { theme } from '../core/theme'
import Loader from "react-native-modal-loader";
import { setAllExpensesCategories, setAllIncomeCategories } from '../redux/action/category';
import normalize from 'react-native-normalize';
import Icon from 'react-native-vector-icons/AntDesign';
import { FakeCurrencyInput } from 'react-native-currency-input';
import DropDownPicker from 'react-native-dropdown-picker';
import { TextInput, Snackbar, List } from 'react-native-paper';
import { setUserToStore } from '../redux/action/user';
import DatePicker from 'react-native-date-picker';


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
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date());
  const [openDate, setOpenDate] = useState(false);

  // useEffect(()=>{
  //   let arr = category[visible==="income" ? "incomeCategories" : "expenseCategories"].map(item => {
  //     return{
  //       label : item.category,
  //       value : item.category,
  //       icon :() => <Image source={{uri : item.icon}} style={{
  //         padding : 4,height : 50 ,width : 50
  //       }} />
  //     }
  //   });
  //   setCategory([...arr]);
  // },[visible])

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
          icon: () => <Image source={{ uri: item.icon }} style={{
            padding: 4, height: 50, width: 50
          }} />
        }
      });
      setCategoryItems([...arr]);
    }
  }

  const addTransaction = async () => {
    if (title.length === 0) {
      ToastAndroid.show('Enter Title to continue', ToastAndroid.SHORT);
      return;
    }
    // if (parseInt(price) < 0 || parseInt(price) > 100000) {
    //   ToastAndroid.show('Price must be min 1');
    //   return;
    // }

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
      ToastAndroid.show('Mention Category', ToastAndroid.SHORT);
      setIsLoading(false);
      return;
    }
    if (body.price === 0 && body.price <= 100000) {
      Alert.alert('Error', 'Price not in range')
      setIsLoading(false);
      return;
    }
    console.log(body)
    let response = await requestHandler(url, body, header, method, navigation);
    let { data } = response;
    if (data.success === true) {
      setTitle('');
      setDescription('');
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
  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: theme.colors.background

    }}>
      <KeyboardAvoidingView
        style={{
          flex: 1,
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{

            flexGrow: 1,
            backgroundColor: theme.colors.background
            // justifyContent: "center"
          }}
          style={{
            flex: 1,

          }}
        >
          <DatePicker
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
          />
          <Loader loading={isLoading} color={theme.colors.primary} />
          <TouchableOpacity
            onPress={() => {
              setOpenDate(true)
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
          </TouchableOpacity>
          <View
            style={{
              flexDirection: "row",
              alignItems: "baseline",
              justifyContent: "center",
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
              width: '90%',
              alignSelf: "center",
              borderRadius: normalize(10),
              padding: normalize(10),
              marginTop: normalize(10)
            }}
          >
            <FakeCurrencyInput
              value={price}
              onChangeValue={setPrice}
              prefix="$ "
              delimiter=","
              separator="."
              precision={2}
              style={{
                fontSize: normalize(22),
                color: theme.colors.white,
                lineHeight: normalize(36.8)
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
              // textAlign :"center",
              alignSelf: "center",
              width: '90%'
            }}
          >
            Enter the price above
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
              width: '90%',
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
              width: '90%',
              alignSelf: "center",
              borderWidth: 0,
              borderColor: theme.colors.background,
              marginVertical: normalize(10)
            }}
            multiline={true}
            numberOfLines={5}
            label="Description"
          />
          <DropDownPicker
            open={open}
            value={value}
            items={categoryItems}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setCategoryItems}
            showTickIcon={true}
            showArrowIcon={true}
            zIndex={1000}
            translation={{
              PLACEHOLDER: "Select Category"
            }}
            dropDownContainerStyle={{
              width: '90%',
              alignSelf: "center",
              height: normalize(160),
              borderColor: theme.colors.primary
            }}
            dropDownDirection="TOP"
            style={{
              width: '90%',
              alignSelf: "center",
              marginVertical: normalize(17),
              borderColor: theme.colors.primary
            }}
          />

          <TouchableOpacity
            style={{
              width: "90%",
              alignSelf: "center",
              backgroundColor: theme.colors.primary,
              padding: normalize(4),
              borderRadius: normalize(4),
              height: normalize(55),
              borderRadius: normalize(10),
              justifyContent: "center",
              marginTop: normalize(10)
            }}
            disabled={isLoading}
            onPress={addTransaction}
          >
            <Text
              style={{
                color: theme.colors.white,
                textAlign: "center",
                fontSize: normalize(19),
                lineHeight: normalize(31.22),
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