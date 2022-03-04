import paho.mqtt.client as mqtt
import json



CONVERSION_TABLE = {
    'Day':   {'value': 1, 'Day': 1, 'Week': 0.14, 'Month': 0.03, 'Year': 0.003, 'unit': 'Day', 'n': 365},
    'Week':  {'value': 2, 'Day': 7, 'Week': 1, 'Month': 0.25, 'Year': 0.019230769, 'unit': 'Week', 'n': 52},
    'Month': {'value': 3, 'Day': 30, 'Week': 4, 'Month': 1, 'Year': 0.08, 'unit': 'Month', 'n': 12},
    'Year':  {'value': 4, 'Day': 365, 'Week': 52, 'Month': 12, 'Year': 1, 'unit': 'Year', 'n': 1},
}


def get_time_period_position(current_plan_budget, plan):
    """ Returns the time period position (i.e. Week 4) of the given 'current_plan_budget' in the given 'plan'. The
        time period position of a budget is at the end of the budget.
    """

    time_period_position = current_plan_budget['time_value']

    for plan_budget in plan['plan_budgets']:
        if plan_budget['position'] < current_plan_budget['position']:
            time_period_position += plan_budget['time_value']

    return time_period_position


def percent_to_decimal(percent):
    """ Converts a float in percentage form (i.e. 30.0) to a float in decimal form (0.300) and returns it.
    """

    return float(float(percent) / 100.00)


def present_value(plan, plan_budget, discount_rate):
    """ Calculates the present value of the given 'plan_budget' using the given decimal 'discount_rate'.
    """

    time_period_position = plan_budget['time_period_position']
    net_returns = plan_budget['net_returns_with_inflation']

    # If last Budget in Plan, add the ending_investment value to net_returns
    if time_period_position == plan['time_period_value']:
        net_returns += plan['ending_investment']

    present_value = net_returns / ((1 + discount_rate) ** (time_period_position * CONVERSION_TABLE[plan['time_period_unit']]['Year']))

    return present_value


def internal_rate_of_return(plan):
    """ Returns the internal rate of return of the given JSON representation of a plan within two decimal places.
        Internal rate of return is the discount rate needed to give a net present value of 0 for the Plan.
    """

    irr = 0
    i = 0
    iteration_limit = 20
    net_present_value = 1

    try:
        while net_present_value < -0.1 or net_present_value > 0.1:
            i += 1
            net_present_value = 0 - plan['beginning_investment']
            for plan_budget in plan['plan_budgets']:
                net_present_value += present_value(plan, plan_budget, percent_to_decimal(irr))

            if net_present_value > 1000:
                irr += 50
            elif net_present_value > 200:
                irr += 20
            elif net_present_value > 100:
                irr += 10
            elif net_present_value > 10:
                irr += 5
            elif net_present_value > 5:
                irr += 1
            elif net_present_value > 1:
                irr += .5
            elif net_present_value > .1:
                irr += .05
            elif net_present_value > .01:
                irr += .01
            elif net_present_value < 0:
                irr -= .01

            if i > iteration_limit:
                raise ValueError("Internal Rate of Return cannot be calculated using this Plan data")

    # FIXME: Return value indicative of failure
    except ValueError as e:
        print e.message
        irr = 0

    return irr


def calculate_irr(client, options):
    """ Subscribe to MQTT topic, calculate IRR using JSON payload, and publish result back to topic.
    """

    def on_connect(client, userdata, flags, rc):
        print "Connected with result code " + str(rc)
        client.subscribe(options['topic'])

    def on_message(client, userdata, msg):
        print "MQTT: " + str(msg.topic)
        payload = json.loads(msg.payload)

        if payload['action'] == 'retrieve':
            irr = internal_rate_of_return(payload['data'])

            client.publish(msg.topic, payload=json.dumps({'action': 'response', 'data': {'internal_rate_of_return': irr}}))

    client.on_connect = on_connect
    client.on_message = on_message
    client.connect(host=options['host'], port=options['port'])
    client.loop_forever()


# Start the service
calculate_irr(client=mqtt.Client(), options={'topic': 'plans/+/calculate_irr', 'host': '54.202.148.216', 'port': 1883})
