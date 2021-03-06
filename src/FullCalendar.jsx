import React, {PropTypes} from 'react';
import DateTable from './date/DateTable';
import MonthTable from './month/MonthTable';
import CalendarMixin from './mixin/CalendarMixin';
import CommonMixin from './mixin/CommonMixin';
import CalendarHeader from './full-calendar/CalendarHeader';

const FullCalendar = React.createClass({
  propTypes: {
    defaultType: PropTypes.string,
    fullscreen: PropTypes.bool,
    monthCellRender: PropTypes.func,
    dateCellRender: PropTypes.func,
    showTypeSwitch: PropTypes.bool,
    selectPrefixCls: PropTypes.string,
    headerComponents: PropTypes.array,
    headerComponent: PropTypes.object, // The whole header component
    headerRender: PropTypes.func,
    showHeader: PropTypes.bool,
  },
  mixins: [CommonMixin, CalendarMixin],
  getDefaultProps() {
    return {
      defaultType: 'date',
      fullscreen: false,
      showTypeSwitch: true,
      showHeader: true,
    };
  },
  getInitialState() {
    return {
      type: this.props.defaultType,
    };
  },
  onMonthSelect(value) {
    this.setType('date');
    this.onSelect(value, { target: 'month' });
  },
  setType(type) {
    this.setState({ type });
  },
  render() {
    const props = this.props;
    const {locale, prefixCls, fullscreen, showHeader, headerComponent, headerRender} = props;
    const {value, type} = this.state;

    let header = null;
    if (showHeader) {
      if (headerRender) {
        header = headerRender(value, type, locale);
      } else {
        const TheHeader = headerComponent || CalendarHeader;
        header = (
          <TheHeader key="calendar-header"
            {...props}
            prefixCls={`${prefixCls}-full`}
            type={type}
            value={value}
            onTypeChange={this.setType}
            onValueChange={this.setValue}/>
        );
      }
    }

    const table = type === 'date' ? (
      <DateTable
        dateRender={props.dateCellRender}
        locale={locale}
        prefixCls={prefixCls}
        onSelect={this.onSelect}
        value={value} />
    ) : (
      <MonthTable
        cellRender={props.monthCellRender}
        locale={locale}
        onSelect={this.onMonthSelect}
        prefixCls={`${prefixCls}-month-panel`}
        value={value} />
    );

    const children = [
      header,
      (<div key="calendar-body" className={`${prefixCls}-calendar-body`}>
        { table }
      </div>),
    ];


    const className = [`${prefixCls}-full`];

    if (fullscreen) {
      className.push(`${prefixCls}-fullscreen`);
    }

    return this.renderRoot({ children, className: className.join(' ') });
  },
});

export default FullCalendar;
