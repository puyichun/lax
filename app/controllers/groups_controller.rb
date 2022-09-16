class GroupsController < ApplicationController
  before_action :authenticate_user!
  before_action :find_group, only: %i[show edit update destroy join quit content]

  def new
    @group = current_user.groups.new
  end

  def index
    @group_query = Group.ransack(params[:q])
    @group = current_user.groups.recent
    @group = @group_query.result if params[:q]
  end

  def show
    if @group.users.include?(current_user)
      @room = @group.room
      render "/rooms/index"
    else
      redirect_to groups_path, notice: "非本頻道成員"
    end
  end

  def create
    @group = current_user.groups.new(group_params)
    if @group.save
      @group.room = Room.create(name: @group.title)
      current_user.groups << @group
      redirect_to groups_path
    end
  end

  def edit; end

  def update
    if @group.update(group_params)
      redirect_to @group
    else
      render :edit
    end
  end

  def join
    user = User.find_by(email: params[:email])
    if user.present?
      if @group.is_member_of?(user.id)
        flash[:notice] = "已經加入了"
        render :join
      else
        @group.users << user
        redirect_to group_path
        flash[:notice] = "已加入"
      end
    end
  end

  def quit
    current_user.groups.destroy(params[:id])
    redirect_to groups_path
  end

  def content; end

  private

  def group_params
    params.require(:group).permit(:description, :title )
  end

  def find_group
    @group = Group.find(params[:id])
  end
end
