import csv
import json
import time
import tweepy

# You must use Python 2.7.x
# Rate limit chart for Twitter REST API - https://dev.twitter.com/rest/public/rate-limits

def loadKeys(key_file):
    # TODO: put in your keys and tokens in the keys.json file,
    #       then implement this method for loading access keys and token from keys.json
    # rtype: str <api_key>, str <api_secret>, str <token>, str <token_secret>

    # Load keys here and replace the empty strings in the return statement with those keys
    with open('keys.json') as json_data:
        d = json.load(json_data)

    return str(d['api_key']),str(d['api_secret']),str(d['token']),str(d['token_secret'])

# Q1.b - 5 Marks
def getFollowers(api, root_user, no_of_followers):
    # TODO: implement the method for fetching 'no_of_followers' followers of 'root_user'
    # rtype: list containing entries in the form of a tuple (follower, root_user)
    primary_followers = []

    # Add code here to populate primary_followers
    follower = api.followers(root_user)
    if len(follower) < no_of_followers:
        for foo in follower:
            primary_followers.append((str(foo.screen_name), root_user))
    else:
        for i in range(0, no_of_followers):
            primary_followers.append((str(follower[i].screen_name), root_user))

    print "primary_follower:"
    print primary_followers
    return primary_followers

# Q1.b - 7 Marks
def getSecondaryFollowers(api, followers_list, no_of_followers):
    # TODO: implement the method for fetching 'no_of_followers' followers for each entry in followers_list
    # rtype: list containing entries in the form of a tuple (follower, followers_list[i])
    secondary_followers = []

    # Add code here to populate secondary_followers
    for user in followers_list:
        try:
            follower = api.followers(user[0])
        except tweepy.TweepError:
            print("Failed to run the command on that user, Skipping...")
        if len(follower) < no_of_followers:
            for foo in follower:
                secondary_followers.append((str(foo.screen_name), user[0]))
        else:
            for i in range(0,no_of_followers):
                secondary_followers.append((str(follower[i].screen_name), user[0]))
    print "secondary_followers:"
    print secondary_followers
    return secondary_followers

# Q1.c - 5 Marks
def getFriends(api, root_user, no_of_friends):
    # TODO: implement the method for fetching 'no_of_friends' friends of 'root_user'
    # rtype: list containing entries in the form of a tuple (root_user, friend)
    primary_friends = []

    # Add code here to populate primary_friends
    friend_id_list = api.friends_ids(root_user)
    if len(friend_id_list) < no_of_friends:
        for id in friend_id_list:
            user = api.get_user(id)
            primary_friends.append((root_user, str(user.screen_name)))
    else:
        for i in range(0, no_of_friends):
            user = api.get_user(friend_id_list[i])
            primary_friends.append((root_user, str(user.screen_name)))
    print "primary_friends:"
    print primary_friends
    return primary_friends

# Q1.c - 7 Marks
def getSecondaryFriends(api, friends_list, no_of_friends):
    # TODO: implement the method for fetching 'no_of_friends' friends for each entry in friends_list
    # rtype: list containing entries in the form of a tuple (friends_list[i], friend)
    secondary_friends = []

    # Add code here to populate secondary_friends
    for pri_friend in friends_list:
        try:
            sec_friend_id = api.friends_ids(pri_friend[1])
        except tweepy.TweepError:
            print("Failed to run the command on that user, Skipping...")
        if len(sec_friend_id) < no_of_friends:
            for id in sec_friend_id:
                user = api.get_user(id)
                secondary_friends.append((pri_friend[1], str(user.screen_name)))
        else:
            for i in range(0, no_of_friends):
                user = api.get_user(sec_friend_id[i])
                secondary_friends.append((pri_friend[1], str(user.screen_name)))
    print "secondary_friends:"
    print secondary_friends
    return secondary_friends

# Q1.b, Q1.c - 6 Marks
def writeToFile(data, output_file):
    # write data to output_file
    # rtype: None
    with open(output_file, 'wb') as csvfile:
        wr = csv.writer(csvfile, quoting=csv.QUOTE_ALL)
        for line in data:
            wr.writerow(line)



"""
NOTE ON GRADING:

We will import the above functions
and use testSubmission() as below
to automatically grade your code.

You may modify testSubmission()
for your testing purposes
but it will not be graded.

It is highly recommended that
you DO NOT put any code outside testSubmission()
as it will break the auto-grader.

Note that your code should work as expected
for any value of ROOT_USER.
"""

def testSubmission():
    KEY_FILE = 'keys.json'
    OUTPUT_FILE_FOLLOWERS = 'followers.csv'
    OUTPUT_FILE_FRIENDS = 'friends.csv'

    ROOT_USER = 'PoloChau'
    NO_OF_FOLLOWERS = 10
    NO_OF_FRIENDS = 10


    api_key, api_secret, token, token_secret = loadKeys(KEY_FILE)

    auth = tweepy.OAuthHandler(api_key, api_secret)
    auth.set_access_token(token, token_secret)
    api = tweepy.API(auth,wait_on_rate_limit=True, wait_on_rate_limit_notify=True)

    primary_followers = getFollowers(api, ROOT_USER, NO_OF_FOLLOWERS)
    secondary_followers = getSecondaryFollowers(api, primary_followers, NO_OF_FOLLOWERS)
    followers = primary_followers + secondary_followers

    primary_friends = getFriends(api, ROOT_USER, NO_OF_FRIENDS)
    secondary_friends = getSecondaryFriends(api, primary_friends, NO_OF_FRIENDS)
    friends = primary_friends + secondary_friends

    writeToFile(followers, OUTPUT_FILE_FOLLOWERS)
    writeToFile(friends, OUTPUT_FILE_FRIENDS)


if __name__ == '__main__':
    testSubmission()

