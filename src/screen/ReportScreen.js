import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import normalize from 'react-native-normalize';
import { ScrollView } from 'react-native-gesture-handler';
import { LineChart } from 'react-native-chart-kit';
import { theme } from '../core/theme';
import { API } from '../utils/url';
import { requestHandler } from '../services';
import MonthPicker from 'react-native-month-year-picker';
import Loader from 'react-native-modal-loader';
const months = ["Jan", "Feb", "March", "April", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];


export const ReportScreen = ({ navigation, user }) => {
    const [expenses, setExpenses] = useState({
        isLoading: true,
        data: []
    });
    const [incomes, setIncomes] = useState({
        isLoading: true,
        data: []
    });
    const [year, setYear] = useState({
        isLoading: true,
        data: []
    });
    const [showPicker, setShowPicker] = useState(false);
    const [date, setDate] = useState(new Date());
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getExpenseReportDate();
        getIncomeReportDate();
    }, [date]);
    let getExpenseReportDate = async () => {
        var firstDay =
            new Date(date.getFullYear(), date.getMonth(), 1);

        var lastDay =
            new Date(date.getFullYear(), date.getMonth() + 1, 0);
        let method = "POST";
        let url = `${API}/expense/report/${user?._id}`;
        let header = {
            'Authorization': `Bearer ${user?.jwtToken}`
        };
        let body = {
            firstDay: firstDay,
            lastDay: lastDay
        };

        let response = await requestHandler(url, body, header, method, navigation);
        if (!response || response?.data?.success === false) {
            setExpenses({
                isLoading: false,
                data: []
            })
            Alert.alert('Error', 'Something Went Wrong');
        }
        const { data } = response;
        setExpenses({
            isLoading: false,
            data: [...data.expenses]
        })
    }
    let getIncomeReportDate = async () => {
        var firstDay =
            new Date(date.getFullYear(), date.getMonth(), 1);

        var lastDay =
            new Date(date.getFullYear(), date.getMonth() + 1, 0);
        let method = "POST";
        let url = `${API}/income/report/${user?._id}`;
        let header = {
            'Authorization': `Bearer ${user?.jwtToken}`
        };
        let body = {
            firstDay: firstDay,
            lastDay: lastDay
        };

        let response = await requestHandler(url, body, header, method, navigation);
        if (!response || response?.data?.success === false) {
            setExpenses({
                isLoading: false,
                data: []
            })
            Alert.alert('Error', 'Something Went Wrong');
        }
        const { data } = response;
        setIncomes({
            isLoading: false,
            data: [...data.incomes]
        })
    }

    const onValueChange = async (event, newDate) => {

        setShowPicker(false);
        const selectedDate = newDate || date;
        setExpenses({
            isLoading: true,
            data: []
        })
        setIncomes({
            isLoading: true,
            data: []
        })
        setDate(selectedDate);
    }


    return (
        <SafeAreaView
            style={{
                flex: 1,
            }}
        >
            <Loader loading={expenses.isLoading || incomes.isLoading} />
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{
                    flex: 1,
                    padding: normalize(15)
                }}
            >
                {showPicker && (
                    <MonthPicker
                        onChange={onValueChange}
                        value={date}
                        minimumDate={new Date(2020, 1)}
                        maximumDate={new Date()}
                        locale="en"
                    />
                )}
                <TouchableOpacity
                    style={{
                        flexDirection: "row",
                        marginBottom: normalize(20)
                    }}
                    disabled={expenses.isLoading || incomes.isLoading}
                    onPress={() => {
                        setShowPicker(true);
                    }}
                >
                    <Text
                        style={{
                            fontSize: normalize(25.12),
                            color: theme.colors.primary,
                            lineHeight: normalize(24.23),

                        }}
                    >

                        {date.getFullYear() + " "}
                        {months[date.getMonth()]}
                    </Text>
                    <Text
                        style={{ marginLeft: normalize(15) }}
                    >change</Text>
                </TouchableOpacity>
                <Text
                    style={{
                        fontSize: normalize(19.12),
                        color: "grey",
                        lineHeight: normalize(24.23),
                        fontWeight: "700",
                    }}
                >
                    Your Expense for this month
                </Text>
                {expenses.isLoading === false && expenses.data.length === 0 &&
                    <View
                        style={{
                            height: normalize(150),
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >
                        <Text
                            style={{
                                textAlign: "center",
                                fontSize: normalize(20)
                            }}
                        >No Records found</Text>
                    </View>
                }

                {expenses.isLoading === false && expenses.data.length !== 0 &&
                    <View
                        style={{
                            marginVertical: normalize(20)
                        }}
                    >

                        <LineChart
                            data={{
                                labels: expenses.data.map(item => item._id),
                                datasets: [
                                    {
                                        data: expenses.data.map(item => Number(item.total).toFixed(2))
                                    }
                                ]
                            }}
                            width={Dimensions.get("window").width - 28} // from react-native
                            height={270}
                            yAxisLabel="₹"
                            yAxisSuffix=""
                            yAxisInterval={1} // optional, defaults to 1
                            chartConfig={{
                                backgroundColor: theme.colors.primary,
                                backgroundGradientFrom: theme.colors.primary,
                                // backgroundGradientTo: "#ffa726",
                                decimalPlaces: 0, // optional, defaults to 2dp
                                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                style: {
                                    borderRadius: normalize(10),
                                },
                                propsForDots: {
                                    r: "7",
                                    strokeWidth: "3",
                                    stroke: "#ffa726"
                                }
                            }}
                            bezier
                            style={{
                                marginVertical: normalize(10),
                                borderRadius: normalize(12)
                            }}
                        />
                    </View>
                }

                <Text
                    style={{
                        fontSize: normalize(19.12),
                        color: "grey",
                        lineHeight: normalize(24.23),
                        fontWeight: "700",
                    }}
                >
                    Your Income for this month
                </Text>
                {incomes.isLoading === false && incomes.data.length === 0 &&
                    <View
                        style={{
                            height: normalize(150),
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >
                        <Text
                            style={{
                                textAlign: "center",
                                fontSize: normalize(20)
                            }}
                        >No Records found</Text>
                    </View>
                }
                {incomes.isLoading === false && incomes.data.length !== 0 &&
                    <View
                        style={{
                            marginVertical: normalize(20)
                        }}
                    >

                        <LineChart
                            data={{
                                labels: incomes.data.map(item => item._id),
                                datasets: [
                                    {
                                        data: incomes.data.map(item => Number(item.total))
                                    }
                                ]
                            }}
                            width={Dimensions.get("window").width - 28} // from react-native
                            height={270}
                            yAxisLabel="₹"
                            yAxisSuffix=""
                            yAxisInterval={1} // optional, defaults to 1
                            chartConfig={{
                                backgroundColor: theme.colors.primary,
                                backgroundGradientFrom: theme.colors.primary,
                                // backgroundGradientTo: "#ffa726",
                                decimalPlaces: 0, // optional, defaults to 2dp
                                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                style: {
                                    borderRadius: normalize(10),
                                },
                                propsForDots: {
                                    r: "7",
                                    strokeWidth: "3",
                                    stroke: "#ffa726"
                                }
                            }}
                            bezier
                            style={{
                                marginVertical: normalize(10),
                                borderRadius: normalize(12)
                            }}
                        />
                    </View>
                }
            </ScrollView>
        </SafeAreaView>
    )
}

const mapStateToProps = state => ({
    user: state.user,
});
export default connect(mapStateToProps, null)(ReportScreen)
