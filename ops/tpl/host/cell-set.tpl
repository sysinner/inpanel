<div id="inops-host-cell-form">
 
  <div id="inops-host-cellset-alert"></div>

  <input type="hidden" name="zone_id" value="{[=it.zone_id]}">

  {[ if (it.meta.id) { ]}
    <input type="hidden" name="id" value="{[=it.meta.id]}">
  {[ } else { ]}
  <div class="l4i-form-group">
    <label class="">Cell ID</label>
    <div>
      <input type="text" name="id" class="form-control" 
	    placeholder="Enter the Cell ID" value="">
    </div>
  </div>
  {[ } ]}

  <div class="l4i-form-group">
    <label>Description</label>
    <input name="description" class="form-control" value="{[=it.description]}">
  </div>

  <div class="l4i-form-group">
    <label>Action</label>
    <div class="">
    {[~it._actions :v]}
      <span class="ids-form-checkbox">
        <input type="radio" name="phase" value="{[=v.action]}" {[ if (v.action == it.phase) { ]}checked="checked"{[ } ]}> {[=v.title]}
      </span>
    {[~]}
    </div>
  </div>  
</div>
