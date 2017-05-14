<div id="losops-host-cell-form">
 
  <div id="losops-host-cellset-alert"></div>

  <div class="l4i-form-group">
    <label>Zone</label>
    <div class="">
    {[~it._zones.items :v]}
      <span class="ids-form-checkbox">
        <input type="radio" name="zone_id" value="{[=v.meta.id]}" {[ if (v.meta.id == it.zone_id) { ]}checked="checked"{[ } ]}> {[=v.meta.id]}
      </span>
    {[~]}
    </div>
  </div>

  {[ if (it.meta.id) { ]}
    <input type="hidden" name="id" value="{[=it.meta.id]}">
  {[ } else { ]}
  <div class="l4i-form-group">
    <label class="">Cell ID</label>
    <div>
      <input type="text" name="id" class="form-control" 
	    placeholder="Enter the Cell ID" value="{[=it.meta.id]}">
    </div>
  </div>
  {[ } ]}

  <div class="l4i-form-group">
    <label>Description</label>
    <input name="description" class="form-control" value="{[=it.description]}">
  </div>

  <div class="l4i-form-group">
    <label>Status</label>
    <div class="">
    {[~it._statusls :v]}
      <span class="ids-form-checkbox">
        <input type="radio" name="phase" value="{[=v.status]}" {[ if (v.status == it.phase) { ]}checked="checked"{[ } ]}> {[=v.title]}
      </span>
    {[~]}
    </div>
  </div>  
</div>
