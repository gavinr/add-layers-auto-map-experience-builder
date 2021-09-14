/** @jsx jsx */
import { React, AllWidgetProps, css, jsx } from "jimu-core";
import {
  JimuMapViewComponent,
  JimuMapView,
} from "jimu-arcgis";

import FeatureLayer from 'esri/layers/FeatureLayer';

interface IState {
  jimuMapView: JimuMapView;
}

export default class Widget extends React.PureComponent<
  AllWidgetProps<any>,
  IState
> {
  // Give types to the modules we import from the ArcGIS API for JavaScript
  // to tell TypeScript what types they are.
  FeatureLayer: typeof __esri.FeatureLayer;

  state = {
    jimuMapView: null,
  };

  activeViewChangeHandler = (jmv: JimuMapView) => {
    if (jmv) {
      this.setState({
        jimuMapView: jmv
      });
    }
  };

  formSubmit = evt => {
    evt.preventDefault();
    if (this.state.jimuMapView) {
      const layer = new FeatureLayer({
        url: 'https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads_Styled/FeatureServer/0'
      });

      // Add the layer to the map (accessed through the Experience Builder JimuMapView data source)
      this.state.jimuMapView.view.map.add(layer);
    }
  };

  /**
   * getArbitraryFirstMapWidgetId
   * 
   * Looks at the _appState variable to get a map object that is in the 
   * Experience. This works best if you know there will be only a single map 
   * within the Experience.
   */
  getArbitraryFirstMapWidgetId = (): string => {
    const appState: any = window._appState;
    // Loop through all the widgets in the config and find the "first"
    // that has the type (uri) of "arcgis-map"
    const arbitraryFirstMapWidgetInfo: { [key: string]: any } = Object.values(appState.appConfig.widgets).find((widgetInfo: any) => {
      return widgetInfo.uri === 'widgets/arcgis/arcgis-map/'
    });

    return arbitraryFirstMapWidgetInfo.id;
  }

  render() {
    return (
      <div className="widget-demo jimu-widget m-2">
        <JimuMapViewComponent
          useMapWidgetId={this.getArbitraryFirstMapWidgetId()}
          onActiveViewChange={this.activeViewChangeHandler}
        />

        <form onSubmit={this.formSubmit}>
          <div>
            <button>Add Layer</button>
          </div>
        </form>
      </div>
    );
  }
}
