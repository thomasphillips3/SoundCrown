# == Schema Information
#
# Table name: tracks
#
#  id                     :integer          not null, primary key
#  title                  :string           not null
#  creator_id             :integer          not null
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  description            :string
#  audio_file_name        :string
#  audio_content_type     :string
#  audio_file_size        :integer
#  audio_updated_at       :datetime
#  cover_art_file_name    :string
#  cover_art_content_type :string
#  cover_art_file_size    :integer
#  cover_art_updated_at   :datetime
#  plays                  :integer          default(0)
#

class Track < ApplicationRecord
  validates :title, :creator_id, presence: true
  validates :title, length: {maximum: 50}
  validates :description, length: {maximum: 200}

  belongs_to :creator,
    class_name: "User",
    foreign_key: :creator_id,
    primary_key: :id

  has_many :comments,
    class_name: "Comment",
    foreign_key: :track_id,
    primary_key: :id

  has_many :taggings, dependent: :destroy
  
  has_many :tags, through: :taggings

  # SEARCH METHODS
  def self.search(query)
    from('tracks').where("lower(title) @@ :q or lower(audio_file_name) @@ :q", q: query.downcase)
  end

  def self.search_by_user(query)
    from('tracks').joins("INNER JOIN users ON users.id = tracks.creator_id").where("lower(username) @@ :q", q: query.downcase)
  end

  def self.search_by_tag(query)
    from('tracks')
      .joins("INNER JOIN taggings ON taggings.track_id = tracks.id")
      .joins("INNER JOIN tags ON tags.id = taggings.tag_id")
      .where("lower(name) @@ :q", q: query.downcase)
  end

  # Similar Tracks Methods
  def similar_tracks(max_num)
    result = []
    self.tags.each do |tag|
      result << Track.search_by_tag(tag.name).order("plays DESC")
    end
    sorted_result = result.flatten.sort_by{ |track| track.plays }.reverse
    max_num = [max_num, sorted_result.count].min
    sorted_result[0...max_num]
  end

  # paperclip
  has_attached_file :audio,
                    # url: ":s3_us_west_url",
                    # you can specify s3_credentials file here!
                    presence: true
  validates_attachment_content_type :audio,
                                    content_type: /\Aaudio\/.*\z/,
                                    :storage => :s3,
                                    :bucket => ENV["s3_bucket"]
                                    # :path => ":env_folder/LOOKATMENOW/:attachment/:id/:style/:filename.:extension"
  # validates_attachment_content_type :audio,
  #   :content_type => [ 'audio/mpeg',
  #                      'audio/x-mpeg',
  #                      'audio/mp3',
  #                      'audio/x-mp3',
  #                      'audio/mpeg3',
  #                      'audio/x-mpeg3',
  #                      'audio/mpg',
  #                      'audio/x-mpg',
  #                      'audio/x-mpegaudio' ]
  validates_with AttachmentSizeValidator, attributes: :audio, less_than: 40.megabytes

  has_attached_file :cover_art,
                   default_url: "http://res.cloudinary.com/dfafbqoxx/image/upload/v1505940306/soundcrown-logo_ueiofl.jpg"
  validates_attachment_content_type :cover_art, content_type: /\Aimage\/.*\Z/


  private

  # interpolate in paperclip
  Paperclip.interpolates :env_folder  do |attachment, style|
    Rails.env.production? ? 'production' : 'development'
  end


end
