---
id: usage-and-recent-trends
---

# Usage and Recent Trends

## Views and Dwell Time {#views-and-dwell-time}

The following usage analytics are provided on a per project basis: 

* Views
* Dwell Time

On the `Views` tab, you can see how many times your project has been viewed over its lifetime. On
the `Dwell Time` tab, you can see the average time spent by users in your experience. Averages do
not take into account days with zero data.

All times in the chart are displayed in local time, but 8th Wall only collects data aggregated
hourly in UTC. Users of the chart in timezones with non-hour offsets will see view data collected
for the nearest UTC hours to their day. Dwell time is only available starting January 1, 2023. The
most recent day will only be composed of partial data up to the current time.

The tooltip times on the graph display the start of the data collection period, and the point value 
is the aggregation of the data from that date.

![ProjectDashboardOverview](/images/console-appkey-usage.jpg)

## CSV export {#csv-export}

CSV formatted data is also available for more advanced analytics. You can download
this data by clicking the download icon above the graph. The CSV fields are the following: 

| Field | Description |
| ----- | ----------- |
| dt | ISO8601 formatted UTC time date string. |
| meanDwellTimeMs | The average session duration, in milliseconds, on the given day. |
| views | The number of views received on the given day. |

## Commercial license views {#commercia-license-views}

Projects with usage based commercial licenses will also display view counts for the current billing
period, if applicable.  Usage is measured in 100 view increments. Usage from previous months can be
found in the [Billing Summary](/legacy/guides/account-settings/#invoices) of the Account page.
