import * as React from 'react';
import {
  css,
  getId
} from '../../Utilities';
import { Button, ButtonType } from '../../Button';
import { IMessageBarProps, MessageBarType } from './MessageBar.Props';
import './MessageBar.scss';

export interface IMessageBarState {
  labelId?: string;
  showContent?: boolean;
}

export class MessageBar extends React.Component<IMessageBarProps, IMessageBarState> {

  public static defaultProps: IMessageBarProps = {
    messageBarType: MessageBarType.info,
    onDismiss: null,
    isMultiline: true,
  };

  private ICON_MAP = {
    [MessageBarType.info]: 'Info',
    [MessageBarType.warning]: 'Info',
    [MessageBarType.error]: 'ErrorBadge',
    [MessageBarType.blocked]: 'Blocked',
    [MessageBarType.remove]: 'Blocked', // TODO remove deprecated value at >= 1.0.0
    [MessageBarType.severeWarning]: 'Warning',
    [MessageBarType.success]: 'Completed'
  };

  private _isMounted: boolean;

  constructor(props: IMessageBarProps) {
    super(props);

    this.state = {
      labelId: getId('MessageBar'),
      showContent: false
    };
  }

  public render(): JSX.Element {
    let { isMultiline } = this.props;

    return isMultiline ? this._renderMultiLine() : this._renderSingleLine();
  }

  public componentDidMount() {

    this._isMounted = true;

    /**
     * Live regions need an update to announce content.
     */
    setTimeout(() => {
      if (this._isMounted) {
        this.setState({ showContent: true });
      }
    }, 10);
  }

  public componentWillUnmount(): void {
    this._isMounted = false;
  }

  private _getActionsDiv(): JSX.Element {
    if (this.props.actions) {
      return <div className={ this.props.isMultiline ? 'ms-MessageBar-actions' : 'ms-MessageBar-actionsOneline' }>
        { this.props.actions }
      </div>;
    }
    return null;
  }

  private _getClassName(): string {
    return css(this.props.className, 'ms-MessageBar', {
      'ms-MessageBar': this.props.messageBarType === MessageBarType.info,
      'ms-MessageBar--error': this.props.messageBarType === MessageBarType.error,
      'ms-MessageBar--blocked': (this.props.messageBarType === MessageBarType.blocked) || (this.props.messageBarType === MessageBarType.remove), // TODO remove deprecated value at >= 1.0.0
      'ms-MessageBar--severeWarning': this.props.messageBarType === MessageBarType.severeWarning,
      'ms-MessageBar--success': this.props.messageBarType === MessageBarType.success,
      'ms-MessageBar--warning': this.props.messageBarType === MessageBarType.warning
    });
  }

  private _getDismissDiv(): JSX.Element {
    if (this.props.onDismiss != null) {
      return <Button
        disabled={ false }
        className='ms-MessageBar-dismissal'
        buttonType={ ButtonType.icon }
        onClick={ this.props.onDismiss }
        icon='Cancel'
        ariaLabel={ this.props.dismissButtonAriaLabel }
      />;
    }
    return null;
  }

  private _getIconSpan(): JSX.Element {
    return <div className='ms-MessageBar-icon'><i className={ `ms-Icon ms-Icon--${this.ICON_MAP[this.props.messageBarType]}` }></i></div>;
  }

  private _getInnerTextClassName(): string {
    return this.props.onDismiss || this.props.actions ? 'ms-MessageBar-innerTextPadding' : 'ms-MessageBar-innerText';
  }

  private _renderMultiLine(): React.ReactElement<React.HTMLProps<HTMLAreaElement>> {
    return (
      <div
        className={ this._getClassName() + ' ms-MessageBar-multiline' }
        role='status'
        aria-live={ this._getAnnouncementPriority() }>
        <div className='ms-MessageBar-content'>
          { this._getIconSpan() }
          <div className='ms-MessageBar-actionables'>
            <div className='ms-MessageBar-text' id={ this.state.labelId }>
              <span className={ this._getInnerTextClassName() }>
                { this.state.showContent && this.props.children }
              </span>
            </div>
            { this._getActionsDiv() }
            { this._getDismissDiv() }
          </div>
        </div>
      </div>
    );
  }

  private _renderSingleLine(): React.ReactElement<React.HTMLProps<HTMLAreaElement>> {
    return (
      <div className={ this._getClassName() + ' ms-MessageBar-singleline' }
        role='status'
        aria-live={ this._getAnnouncementPriority() }>
        <div className='ms-MessageBar-content'>
          { this._getIconSpan() }
          <div className='ms-MessageBar-actionables'>
            <div className='ms-MessageBar-text' id={ this.state.labelId }>
              <span className={ this._getInnerTextClassName() }>
                { this.state.showContent && this.props.children }
              </span>
            </div>
          </div>
          { this._getActionsDiv() }
          <div className="ms-MessageBar-dismissalOneline">
            { this._getDismissDiv() }
          </div>
        </div>
      </div>
    );
  }

  private _getAnnouncementPriority(): string {
    switch (this.props.messageBarType) {
      case MessageBarType.blocked:
      case MessageBarType.error:
      case MessageBarType.severeWarning:
        return 'assertive';
    }
    return 'polite';
  }
}
