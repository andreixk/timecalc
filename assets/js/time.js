String.prototype.minTwo = function () {
	// will ensure that there's at least 2 digits
	return (this.length<2) ? ("00" + this).substr(-2) : this;
};
Number.prototype.minTwo = function () {
	return ('' + this).minTwo();
};
Number.prototype.round = function (precision) {
	return Math.round(this*Math.pow(10,precision)) / Math.pow(10,precision);
};
var v = new Vue({
	el: "#app"
	,data : {
		days:[{tin:'',tout:''}]
	}
	,computed : {
		totalHours : function () {
			var sum = 0;
			for (var i = 0; i < this.days.length; i++) {
				sum += this.calcHours(this.days[i]);
			}
			return sum;
		}

	}
	,methods : {
		addLunch : function (dayNum) {
			this.$set(this.days[dayNum],'lin','');
			this.$set(this.days[dayNum],'lout','');
		}
		/**
		 * Calculates total hours worked for a day
		 * @param  {Object} day contains 'tin', 'tout' (times in/out) and optionally 'lin', 'lout' (lunch times in/out)
		 * @return {float} 
		 */
		,calcHours : function (day) {
			// convert hh:mm into just hours (also check for am/pm)
			if(!(day.tout && day.tin)) return 0;
			var diff = this.toHR(day.tout) - this.toHR(day.tin); // calculate the total time difference
			var lunch = 0; //time taken for lunch
			if(day.lin && day.lout) lunch = this.toHR(day.lout) - this.toHR(day.lin);
			if(lunch<0) lunch += 24; //the lunch goes over to the next day - simply shift it by 12 hours to get the positive number
			return ((diff>0) ? diff : diff + 24) - lunch; //if difference is negative - the time 'out' must be the next day
		}
		// convert time from HH:MM [a.m.|p.m] into decimal hours (e.g. 6:30 PM -> 18.5)
		,toHR : function (time) {
			var rx = /(\d+):?(\d*)\s*((a|p).?m.?)?\s*/gi;
			var res = rx.exec(time);
			if (!res) return 0;
			var hr = res[1];
			var mn = res[2] | "00";
			var ap = res[3];
			if (hr == undefined) return 0;
			if(hr.length<4) { //time is either in HH:MM (24hr or AM/PM) format convert it to the military format:
				if((+hr)>0 && (+hr)<12 && ap && ap[0].toLowerCase()=='p') hr = ((+hr) + 12) + ''; //time is in PM - convert it to 24hr by simply adding 12
				if(hr==12 && ap && ap[0].toLowerCase()=='a') hr = '00'; //12am is 00 in 24-hr time
				hr = hr.minTwo() + mn.minTwo();
			}
			// do a sanity check - hr[0:2] can't be more than 24
			//time is in military format - just return the hours with decimal
			return (+hr.substr(0,2)) + (+hr.substr(2,2)) / 60;
		}
		,fmtHours : function (hours,decimal) {
			if (decimal) return hours.toFixed(2)+'';
			return Math.floor(hours).minTwo() + ':' + Math.round((hours - Math.floor(hours)) * 60).minTwo();
		}
	}
});