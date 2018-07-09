import * as React from 'react';
import {
    LayoutChangeEvent,
    TouchableOpacity,
    View
} from 'react-native';
import { IFlexProps } from '../BaseProps';

interface IProps extends IFlexProps {
    style?: any;
    onLayoutChange?: (width: number, height: number) => void;
    onPress?: () => void;
}

interface IState {
    width: number;
    height: number;
}

export class FlexBox extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            width: 0,
            height: 0,
        };
    }

    public render() {
        if (this.props.onPress) {
            return this.renderTouchableBox();
        }
        return this.renderBox();
    }

    public renderBox() {
        return (
            <View
                style={[
                    this.getChildrenFlexStyle(),
                    this.getFlexStyle(),
                    this.getSizeStyle(),
                    this.getVerticalMarginStyle(),
                    this.getHorizontalMarginStyle(),
                    this.props.style,
                ]}
                onLayout={this.onLayoutChange}
            >
                {this.renderChildren()}
            </View>
        );
    }

    public renderTouchableBox() {
        return (
            <TouchableOpacity
                style={[
                    this.getChildrenFlexStyle(),
                    this.getFlexStyle(),
                    this.getSizeStyle(),
                    this.getVerticalMarginStyle(),
                    this.getHorizontalMarginStyle(),
                    this.props.style,
                ]}
                onLayout={this.onLayoutChange}
                onPress={this.props.onPress}
            >
                {this.renderChildren()}
            </TouchableOpacity>
        );
    }

    private renderChildren = () => {
        if (this.props.children) {
            return React.Children.map(this.props.children, (child, index) => {
                if (child) {
                    if (typeof child !== 'string' && typeof child !== 'number') {
                        if (this.props.width === 'auto') {
                            return React.cloneElement(child, {
                                // If auto, use the container's width as child's container's width,
                                // this will allow the child to resize maximum to container's size.
                                containerWidth: this.props.containerWidth,
                                containerHeight: this.props.containerHeight
                            });
                        } else {
                            return React.cloneElement(child, {
                                // If not auto, this node will already have a size. Use this size as 
                                // child's container size, will allow the child to resize maximum to 
                                // this node's size.
                                containerWidth: this.state.width,
                                containerHeight: this.state.height
                            });
                        }
                    }
                }
            });
        }
        return undefined;
    }

    private onLayoutChange = (event?: LayoutChangeEvent) => {
        let width = event.nativeEvent.layout.width;
        let height = event.nativeEvent.layout.height;

        this.setState({
            width: width,
            height: height
        }, () => {
            if (this.props.onLayoutChange) {
                this.props.onLayoutChange(width, height);
            }
        });
    }

    private getFlexStyle = () => {
        if (this.props.flex) {
            return {
                flex: this.props.flex
            };
        }
        return {};
    }

    private getChildrenFlexStyle = () => {
        let result: any = {
            flexDirection: this.props.flexDirection,
            alignItems: this.props.wrap === 'wrap' ? 'flex-start' : this.props.alignItems,
            justifyContent: this.props.justifyContent,
            height: this.props.height,
            flexWrap: this.props.wrap,
        };
        return result;
    }

    private getSizeStyle = () => {
        if (this.props.width === 'auto') {
            return {
                flex: 0
            };
        }
        if (this.props.width === 'stretch') {
            return {
                flex: 1
            };
        }
        if (this.props.relativeWidth && typeof this.props.width === 'number') {
            return {
                flex: this.props.width
            };
        }
        return {
            width: this.props.width
        };
    }

    private getVerticalMarginStyle = () => {
        if (this.props.vIndex > 0) {
            return {
                marginTop: this.props.vSpace,
            };
        }
        return {};
    }

    private getHorizontalMarginStyle = () => {
        if (this.props.hIndex > 0) {
            return {
                marginLeft: this.props.hSpace,
            };
        }
        return {};
    }
}