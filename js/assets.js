class AssetManager
{

  getAssetByName(name)
  {
    return this._assets[name];
  }

  constructor(assetList, callback)
  {
    this._assets = {};

    console.time('loaded all assets in');
    this._loadAssets(assetList, callback);
  }

  // For testing only
  loadAsset(name)
  {
    let path = this._getPath(name);
    console.log('loading', path);
    fetch(path).then(response => response.text()).
                then(data => {this._onAssetLoaded(name, data)});
  }

  //============================================================================
  // Internal functions
  //============================================================================
  _loadAssets(assetList, callback)
  {
    if (assetList.length)
    {
      let name = assetList.pop();
      let path = this._getPath(name);
      console.log('loading', path);
      fetch(path).then(response => response.text()).
                  then(data => {this._onAssetLoaded(name, data),
                                this._loadAssets(assetList, callback)});
    }
    else
    {
      console.timeEnd('loaded all assets in');
      callback(this);
    }
  }

  _getPath(name)
  {
    switch(name.split('.')[1])
    {
      case 'obj':
        return 'data/models/' + name;
      case 'vert':
      case 'frag':
        return 'data/shaders/' + name;
    }
  }

  _onAssetLoaded(name, data)
  {
    this._assets[name] = data;
  }
}