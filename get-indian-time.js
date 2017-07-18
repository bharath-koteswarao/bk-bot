/**
 * Created by koteswarao on 18-07-2017.
 */
var currentTime = new Date();
var currentOffset = currentTime.getTimezoneOffset();
var ISTOffset = 330;
var ISTTime = new Date(currentTime.getTime() + (ISTOffset + currentOffset)*60000);
module.exports=ISTTime;